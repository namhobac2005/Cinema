const express = require('express');
const { getPool, sql } = require('./db');
const router = express.Router();

// Middleware kiểm tra kết nối database
router.use((req, res, next) => {
  try {
    getPool();
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Chưa kết nối đến cơ sở dữ liệu.',
    });
  }
});

// GET /booking/theaters - Lấy danh sách rạp
router.get('/theaters', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    
    const query = `
      SELECT 
        ID as id,
        TenRap as name,
        DiaChi as address,
        DiaChi as city,
        TrangThai as status
      FROM Rap
      WHERE TrangThai = 'HoatDong'
      ORDER BY TenRap
    `;
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách rạp:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách rạp.' });
  }
});

// GET /booking/theaters/:theaterId/movies - Lấy danh sách phim theo rạp
router.get('/theaters/:theaterId/movies', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const { theaterId } = req.params;
    
    const query = `
      SELECT DISTINCT
        p.ID as id,
        p.TenPhim as tenPhim,
        p.MoTa as moTa,
        p.ThoiLuong as thoiLuong,
        p.XuatXu as xuatXu,
        p.DangPhim as dangPhim,
        p.NgayPhatHanh as ngayPhatHanh,
        p.TrailerURL as trailerURL,
        p.PosterURL as posterURL,
        p.GioiHanTuoi as gioiHanTuoi,
        p.LongTieng as longTieng,
        p.PhuDe as phuDe
      FROM Phim p
      INNER JOIN SuatChieu sc ON p.ID = sc.Phim_ID
      WHERE sc.Rap_ID = @theaterId
        AND p.TrangThaiPhim IN ('DangChieu', 'SapChieu')
        AND sc.TrangThai = 'DangMo'
      ORDER BY p.TenPhim
    `;
    
    request.input('theaterId', sql.Int, theaterId);
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách phim theo rạp:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách phim.' });
  }
});

// GET /booking/showtimes - Lấy danh sách suất chiếu
router.get('/showtimes', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const { theaterId, movieId, date } = req.query;
    
    let query = `
      SELECT 
        sc.ID as id,
        sc.ThoiGianBatDau as startTime,
        sc.SoPhong as phongChieu,
        sc.Rap_ID as rapId,
        r.TenRap as rapName,
        pc.LoaiPhong as dinhDang,
        p.LongTieng as longTieng,
        p.PhuDe as phuDe,
        p.GioiHanTuoi as gioiHanTuoi,
        ISNULL(
          (SELECT TOP 1 gv.DonGia 
           FROM GiaVe gv 
           WHERE gv.DinhDangPhim = pc.LoaiPhong 
             AND gv.LoaiGhe = 'Thuong'
             AND gv.LoaiSuatChieu = CASE 
               WHEN DATEPART(WEEKDAY, sc.ThoiGianBatDau) IN (1, 7) THEN 'CuoiTuan'
               ELSE 'NgayThuong'
             END
             AND gv.TrangThai = 'ConHieuLuc'
             AND (gv.NgayBatDauApDung IS NULL OR gv.NgayBatDauApDung <= CAST(sc.ThoiGianBatDau AS DATE))
             AND (gv.NgayKetThucApDung IS NULL OR gv.NgayKetThucApDung >= CAST(sc.ThoiGianBatDau AS DATE))
           ORDER BY gv.ID DESC
          ), 
          CASE 
            WHEN pc.LoaiPhong = 'IMAX' THEN 180000
            WHEN pc.LoaiPhong = '4DX' THEN 200000
            WHEN pc.LoaiPhong = '3D' THEN 120000
            ELSE 80000
          END
        ) as giaVe
      FROM SuatChieu sc
      INNER JOIN Rap r ON sc.Rap_ID = r.ID
      INNER JOIN Phim p ON sc.Phim_ID = p.ID
      INNER JOIN PhongChieu pc ON sc.Rap_ID = pc.Rap_ID AND sc.SoPhong = pc.SoPhong
      WHERE sc.TrangThai = 'DangMo'
    `;
    
    if (theaterId) {
      query += ` AND sc.Rap_ID = @theaterId`;
      request.input('theaterId', sql.Int, parseInt(theaterId));
    }
    
    if (movieId) {
      query += ` AND sc.Phim_ID = @movieId`;
      request.input('movieId', sql.Int, parseInt(movieId));
    }
    
    if (date) {
      query += ` AND CAST(sc.ThoiGianBatDau AS DATE) = @date`;
      request.input('date', sql.Date, date);
    }
    
    query += ` ORDER BY sc.ThoiGianBatDau`;
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách suất chiếu:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách suất chiếu.' });
  }
});

// GET /booking/showtimes/:showtimeId/seats
router.get('/showtimes/:showtimeId/seats', async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const pool = getPool();
    
    const scRes = await pool.request().input('id', sql.Int, showtimeId)
      .query(`
        SELECT sc.ID, sc.ThoiGianBatDau, pc.LoaiPhong, p.TenPhim
        FROM SuatChieu sc
        JOIN PhongChieu pc ON sc.Rap_ID = pc.Rap_ID AND sc.SoPhong = pc.SoPhong
        JOIN Phim p ON sc.Phim_ID = p.ID
        WHERE sc.ID = @id
      `);
    
    if (scRes.recordset.length === 0) return res.status(404).json({message: 'Suất chiếu không tồn tại'});
    const showtime = scRes.recordset[0];

    const result = await pool.request()
      .input('SuatChieu_ID', sql.Int, showtimeId)
      .execute('sp_LayTrangThaiGhe');
    
    const seats = result.recordset.map(seat => {
      let status = 'available';
      if (seat.TrangThai === 'DaBan') status = 'booked';
      else if (seat.TrangThai === 'DangGiu') status = 'processing';

      let basePrice = 80000; 
      if (showtime.LoaiPhong === 'IMAX') basePrice = 180000;
      else if (showtime.LoaiPhong === '4DX') basePrice = 200000;
      else if (showtime.LoaiPhong === '3D') basePrice = 120000;

      let finalPrice = basePrice;
      if (seat.LoaiGhe === 'VIP') finalPrice += 20000;
      else if (seat.LoaiGhe === 'Doi') finalPrice = basePrice * 2; 

      return {
        id: `${seat.HangGhe}${seat.SoGhe}`, // ID ghế: A1, B2...
        row: seat.HangGhe,
        col: parseInt(seat.SoGhe),
        type: seat.LoaiGhe, // 'Thuong', 'VIP', 'Doi'
        status: status,
        price: finalPrice
      };
    });
      
    res.json({ 
      showtime: {
        id: showtime.ID,
        movieName: showtime.TenPhim,
        format: showtime.LoaiPhong,
        startTime: showtime.ThoiGianBatDau
      },
      seats: seats 
    });

  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: 'Lỗi server: ' + err.message }); 
  }
});

// GET /booking/products
router.get('/products', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT ID as id, TenSP as name, DonGia as price, PhanLoai as category, TonKho as stock 
      FROM SanPham WHERE TonKho > 0
    `);
    res.json(result.recordset);
  } catch (err) { res.status(500).json({ message: 'Lỗi server' }); }
});

// POST /booking/create - Tạo đơn đặt vé và giữ chỗ
router.post('/create', async (req, res) => {
  const { KhachHang_ID, SuatChieu_ID, DanhSachGhe, DanhSachSanPham } = req.body;
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const gheTable = new sql.Table('GheDatType'); // Type trong SQL
    gheTable.columns.add('HangGhe', sql.VarChar(5));
    gheTable.columns.add('SoGhe', sql.VarChar(5));
    DanhSachGhe.forEach(g => {
            const hang = g.HangGhe || g.row; 
            const so = g.SoGhe || g.col || g.number;

            if (hang === undefined || so === undefined) {
                console.error("DỮ LIỆU GHẾ BỊ LỖI (UNDEFINED):", g);
                throw new Error("Dữ liệu ghế không hợp lệ (Thiếu HangGhe hoặc SoGhe)");
            }

            gheTable.rows.add(String(hang), String(so));
        });

    const reqSP = new sql.Request(transaction);
    reqSP.input('KhachHang_ID', sql.Int, KhachHang_ID || null);
    reqSP.input('SuatChieu_ID', sql.Int, SuatChieu_ID);
    reqSP.input('DanhSachGhe', gheTable);

    const spResult = await reqSP.execute('sp_DatVe_TaoHoaDon');
    const hoaDonId = spResult.recordset[0].HoaDonID; 

    if (!hoaDonId) {
        throw new Error("Lỗi: Stored Procedure không trả về HoaDonID.");
    }

    if (DanhSachSanPham && DanhSachSanPham.length > 0) {
      for (const p of DanhSachSanPham) {
        if (!p.SanPham_ID || !p.SoLuong) {
            console.error("Dữ liệu sản phẩm lỗi (Item):", p);
            throw new Error("Dữ liệu sản phẩm không hợp lệ (Thiếu SanPham_ID hoặc SoLuong).");
        }
        
        const reqProd = new sql.Request(transaction);
        // Check tồn kho & lấy giá
        const stockCheck = await reqProd.query(`
          SELECT DonGia, TonKho, TenSP FROM SanPham WITH (UPDLOCK) WHERE ID = ${p.SanPham_ID}
        `);
        
        if (stockCheck.recordset.length === 0) throw new Error(`Sản phẩm ID ${p.SanPham_ID} không tồn tại.`);
        const { DonGia, TonKho, TenSP } = stockCheck.recordset[0];

        if (TonKho < p.SoLuong) throw new Error(`Sản phẩm ${TenSP} không đủ hàng.`);

        // Insert vào HoaDon_SanPham và Trừ kho
        await reqProd.query(`
          INSERT INTO HoaDon_SanPham (HoaDon_ID, SanPham_ID, SoLuong, DonGiaLucBan)
          VALUES (${hoaDonId}, ${p.SanPham_ID}, ${p.SoLuong}, ${DonGia});
          UPDATE SanPham SET TonKho = TonKho - ${p.SoLuong} WHERE ID = ${p.SanPham_ID};
        `);
      }
    }

    await transaction.commit();
    res.json({ message: 'Giữ chỗ thành công', hoaDonId: hoaDonId });

  } catch (err) {
    if (transaction._begun) await transaction.rollback();
    console.error("Booking Error:", err);
    const msg = err.message.includes('đã có người đặt') 
      ? 'Một trong các ghế bạn chọn vừa có người đặt. Vui lòng chọn lại.' 
      : err.message;
    res.status(400).json({ message: msg });
  }
});

// POST /booking/confirm
router.post('/confirm', async (req, res) => {
  const { hoaDonId, paymentMethod, voucherCode, guestInfo } = req.body;
  try {
    const pool = getPool();
    const reqSP = pool.request();
    reqSP.input('HoaDon_ID', sql.Int, hoaDonId);
    reqSP.input('PhuongThucThanhToan', sql.VarChar(50), paymentMethod || 'TienMat');
    reqSP.input('MaVoucher', sql.VarChar(20), voucherCode || null);

    const result = await reqSP.execute('sp_XacNhanThanhToan');
    
    res.json({ 
      message: 'Thanh toán thành công!',
      data: result.recordset[0] 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /booking/cancel
router.post('/cancel', async (req, res) => {
  const { hoaDonId } = req.body;
  if(!hoaDonId) return res.status(400).json({message: 'Thiếu ID'});

  const pool = getPool();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const reqSql = new sql.Request(transaction);

    // Hoàn kho sản phẩm trước
    const prods = await reqSql.query(`SELECT SanPham_ID, SoLuong FROM HoaDon_SanPham WHERE HoaDon_ID = ${hoaDonId}`);
    for (const p of prods.recordset) {
      await reqSql.query(`UPDATE SanPham SET TonKho = TonKho + ${p.SoLuong} WHERE ID = ${p.SanPham_ID}`);
    }

    // Cập nhật trạng thái hủy
    await reqSql.query(`
      UPDATE HoaDon SET TrangThaiThanhToan = 'DaHuy' WHERE ID = ${hoaDonId};
      UPDATE Ve SET TrangThai = 'DaHuy' WHERE HoaDon_ID = ${hoaDonId};
    `);

    await transaction.commit();
    res.json({ message: 'Đã hủy đơn hàng' });
  } catch(err) {
    if (transaction._begun) await transaction.rollback();
    res.status(500).json({ message: err.message });
  }
});

// POST /booking/voucher/check - Kiểm tra voucher
router.post('/voucher/check', async (req, res) => {
  try {
    const { code } = req.body;
    const pool = getPool();
    const result = await pool.request()
      .input('code', sql.VarChar(20), code)
      .query(`SELECT * FROM Voucher WHERE MaGiam = @code AND SoLuong > 0`);
    
    if (result.recordset.length === 0) return res.status(404).json({ message: 'Voucher không hợp lệ' });
    res.json(result.recordset[0]);
  } catch (err) { res.status(500).json({ message: 'Lỗi server' }); }
});

module.exports = router;
