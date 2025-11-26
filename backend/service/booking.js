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

// GET /booking/showtimes/:showtimeId/seats - Lấy sơ đồ ghế
router.get('/showtimes/:showtimeId/seats', async (req, res) => {
  try {
    const pool = getPool();
    const { showtimeId } = req.params;
    
    // Lấy thông tin suất chiếu
    const showtimeRequest = pool.request();
    showtimeRequest.input('showtimeId', sql.Int, showtimeId);
    
    const showtimeQuery = `
      SELECT 
        sc.ID as id,
        sc.Rap_ID as rapId,
        r.TenRap as rapName,
        sc.SoPhong as room,
        sc.ThoiGianBatDau as startTime,
        pc.LoaiPhong as format,
        p.LongTieng as longTieng,
        p.PhuDe as phuDe,
        p.TenPhim as movieName
      FROM SuatChieu sc
      INNER JOIN Rap r ON sc.Rap_ID = r.ID
      INNER JOIN Phim p ON sc.Phim_ID = p.ID
      INNER JOIN PhongChieu pc ON sc.Rap_ID = pc.Rap_ID AND sc.SoPhong = pc.SoPhong
      WHERE sc.ID = @showtimeId
    `;
    
    const showtimeResult = await showtimeRequest.query(showtimeQuery);
    
    if (showtimeResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu.' });
    }
    
    const showtime = showtimeResult.recordset[0];
    
    // Lấy danh sách ghế và trạng thái
    const seatsRequest = pool.request();
    seatsRequest.input('showtimeId', sql.Int, showtimeId);
    seatsRequest.input('rapId', sql.Int, showtime.rapId);
    seatsRequest.input('soPhong', sql.VarChar(10), showtime.room);
    
    const seatsQuery = `
      SELECT 
        g.HangGhe as row,
        g.SoGhe as col,
        g.LoaiGhe as type,
        CASE 
          WHEN v.ID IS NOT NULL AND v.TrangThai IN ('DaThanhToan', 'GiuCho') THEN 
            CASE 
              WHEN v.TrangThai = 'DaThanhToan' THEN 'booked'
              WHEN v.TrangThai = 'GiuCho' THEN 'processing'
            END
          ELSE 'available'
        END as status,
        CONCAT(g.HangGhe, g.SoGhe) as id,
        ISNULL(
          (SELECT TOP 1 gv.DonGia 
           FROM GiaVe gv 
           WHERE gv.DinhDangPhim = @format
             AND gv.LoaiGhe = g.LoaiGhe
             AND gv.LoaiSuatChieu = CASE 
               WHEN DATEPART(WEEKDAY, @startTime) IN (1, 7) THEN 'CuoiTuan'
               ELSE 'NgayThuong'
             END
             AND gv.TrangThai = 'ConHieuLuc'
             AND (gv.NgayBatDauApDung IS NULL OR gv.NgayBatDauApDung <= CAST(@startTime AS DATE))
             AND (gv.NgayKetThucApDung IS NULL OR gv.NgayKetThucApDung >= CAST(@startTime AS DATE))
           ORDER BY gv.ID DESC
          ), 
          CASE 
            WHEN g.LoaiGhe = 'VIP' THEN 100000
            WHEN g.LoaiGhe = 'Doi' THEN 160000
            ELSE 80000
          END
        ) as price
      FROM Ghe g
      LEFT JOIN Ve v ON g.Rap_ID = v.Rap_ID 
        AND g.SoPhong = v.SoPhong 
        AND g.HangGhe = v.HangGhe 
        AND g.SoGhe = v.SoGhe 
        AND v.SuatChieu_ID = @showtimeId
        AND v.TrangThai <> 'DaHuy'
      WHERE g.Rap_ID = @rapId 
        AND g.SoPhong = @soPhong
      ORDER BY g.HangGhe, g.SoGhe
    `;
    
    seatsRequest.input('format', sql.VarChar(10), showtime.format);
    seatsRequest.input('startTime', sql.DateTime, showtime.startTime);
    
    const seatsResult = await seatsRequest.query(seatsQuery);
    
    res.json({
      showtime: showtime,
      seats: seatsResult.recordset
    });
  } catch (err) {
    console.error('Lỗi khi lấy sơ đồ ghế:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy sơ đồ ghế.' });
  }
});

// POST /booking/voucher/apply - Áp dụng voucher
router.post('/voucher/apply', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const { code, total } = req.body;
    
    if (!code || !total) {
      return res.status(400).json({ message: 'Thiếu thông tin mã giảm giá hoặc tổng tiền.' });
    }
    
    const query = `
      SELECT 
        ID as voucherId,
        MaGiam as code,
        Loai as type,
        MucGiam as amount,
        CASE 
          WHEN Loai = 'PhanTram' THEN (@total * MucGiam / 100)
          ELSE MucGiam
        END as discountValue
      FROM Voucher
      WHERE MaGiam = @code 
        AND SoLuong > 0
    `;
    
    request.input('code', sql.VarChar(20), code);
    request.input('total', sql.Decimal(10, 2), total);
    
    const result = await request.query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng.' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Lỗi khi áp dụng voucher:', err);
    res.status(500).json({ message: 'Lỗi server khi áp dụng voucher.' });
  }
});

// POST /booking/checkout - Thanh toán đặt vé
router.post('/checkout', async (req, res) => {
  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const { customerId, showtimeId, seats, products, voucherCode, paymentMethod } = req.body;
    
    if (!showtimeId || !seats || seats.length === 0 || !paymentMethod) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Thiếu thông tin đặt vé.' });
    }
    
    // Lấy thông tin suất chiếu
    const showtimeRequest = new sql.Request(transaction);
    showtimeRequest.input('showtimeId', sql.Int, showtimeId);
    
    const showtimeQuery = `
      SELECT 
        sc.ID,
        sc.Rap_ID,
        sc.SoPhong,
        sc.TrangThai,
        r.TenRap as rapName,
        sc.ThoiGianBatDau as startTime,
        pc.LoaiPhong as format,
        p.TenPhim as movieName
      FROM SuatChieu sc
      INNER JOIN Rap r ON sc.Rap_ID = r.ID
      INNER JOIN Phim p ON sc.Phim_ID = p.ID
      INNER JOIN PhongChieu pc ON sc.Rap_ID = pc.Rap_ID AND sc.SoPhong = pc.SoPhong
      WHERE sc.ID = @showtimeId
    `;
    
    const showtimeResult = await showtimeRequest.query(showtimeQuery);
    
    if (showtimeResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy suất chiếu.' });
    }
    
    const showtime = showtimeResult.recordset[0];
    
    if (showtime.TrangThai !== 'DangMo') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Suất chiếu không còn mở.' });
    }
    
    // Kiểm tra ghế có sẵn không
    for (const seat of seats) {
      const checkSeatRequest = new sql.Request(transaction);
      checkSeatRequest.input('rapId', sql.Int, showtime.Rap_ID);
      checkSeatRequest.input('soPhong', sql.VarChar(10), showtime.SoPhong);
      checkSeatRequest.input('hangGhe', sql.VarChar(5), seat.row);
      checkSeatRequest.input('soGhe', sql.VarChar(5), seat.number.toString());
      checkSeatRequest.input('showtimeId', sql.Int, showtimeId);
      
      const checkSeatQuery = `
        SELECT g.LoaiGhe, v.ID as VeID, v.TrangThai
        FROM Ghe g
        LEFT JOIN Ve v ON g.Rap_ID = v.Rap_ID 
          AND g.SoPhong = v.SoPhong 
          AND g.HangGhe = v.HangGhe 
          AND g.SoGhe = v.SoGhe 
          AND v.SuatChieu_ID = @showtimeId
          AND v.TrangThai <> 'DaHuy'
        WHERE g.Rap_ID = @rapId 
          AND g.SoPhong = @soPhong 
          AND g.HangGhe = @hangGhe 
          AND g.SoGhe = @soGhe
      `;
      
      const checkResult = await checkSeatRequest.query(checkSeatQuery);
      
      if (checkResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: `Ghế ${seat.row}${seat.number} không tồn tại.` });
      }
      
      const seatInfo = checkResult.recordset[0];
      
      if (seatInfo.VeID && (seatInfo.TrangThai === 'DaThanhToan' || seatInfo.TrangThai === 'GiuCho')) {
        await transaction.rollback();
        return res.status(400).json({ message: `Ghế ${seat.row}${seat.number} đã được đặt.` });
      }
    }
    
    // Tạo hóa đơn
    const createInvoiceRequest = new sql.Request(transaction);
    createInvoiceRequest.input('khachHangId', sql.Int, customerId || null);
    createInvoiceRequest.input('trangThai', sql.VarChar(20), 'DaThanhToan');
    createInvoiceRequest.input('phuongThuc', sql.VarChar(50), paymentMethod);
    
    const createInvoiceQuery = `
      INSERT INTO HoaDon (KhachHang_ID, TrangThaiThanhToan, PhuongThucThanhToan)
      OUTPUT INSERTED.ID
      VALUES (@khachHangId, @trangThai, @phuongThuc)
    `;
    
    const invoiceResult = await createInvoiceRequest.query(createInvoiceQuery);
    const invoiceId = invoiceResult.recordset[0].ID;
    
    // Tạo mã booking
    const bookingCode = `BK${invoiceId.toString().padStart(6, '0')}`;
    
    let ticketTotal = 0;
    const ticketDetails = [];
    
    // Tạo vé cho từng ghế
    for (const seat of seats) {
      const createTicketRequest = new sql.Request(transaction);
      createTicketRequest.input('hoaDonId', sql.Int, invoiceId);
      createTicketRequest.input('suatChieuId', sql.Int, showtimeId);
      createTicketRequest.input('rapId', sql.Int, showtime.Rap_ID);
      createTicketRequest.input('soPhong', sql.VarChar(10), showtime.SoPhong);
      createTicketRequest.input('hangGhe', sql.VarChar(5), seat.row);
      createTicketRequest.input('soGhe', sql.VarChar(5), seat.number.toString());
      createTicketRequest.input('format', sql.VarChar(10), showtime.format);
      createTicketRequest.input('startTime', sql.DateTime, showtime.startTime);
      
      // Lấy giá vé và loại ghế
      const priceQuery = `
        SELECT 
          g.LoaiGhe,
          ISNULL(
            (SELECT TOP 1 gv.DonGia 
             FROM GiaVe gv 
             WHERE gv.DinhDangPhim = @format
               AND gv.LoaiGhe = g.LoaiGhe
               AND gv.LoaiSuatChieu = CASE 
                 WHEN DATEPART(WEEKDAY, @startTime) IN (1, 7) THEN 'CuoiTuan'
                 ELSE 'NgayThuong'
               END
               AND gv.TrangThai = 'ConHieuLuc'
               AND (gv.NgayBatDauApDung IS NULL OR gv.NgayBatDauApDung <= CAST(@startTime AS DATE))
               AND (gv.NgayKetThucApDung IS NULL OR gv.NgayKetThucApDung >= CAST(@startTime AS DATE))
             ORDER BY gv.ID DESC
            ), 
            CASE 
              WHEN g.LoaiGhe = 'VIP' THEN 100000
              WHEN g.LoaiGhe = 'Doi' THEN 160000
              ELSE 80000
            END
          ) as GiaVe
        FROM Ghe g
        WHERE g.Rap_ID = @rapId 
          AND g.SoPhong = @soPhong 
          AND g.HangGhe = @hangGhe 
          AND g.SoGhe = @soGhe
      `;
      
      const priceResult = await createTicketRequest.query(priceQuery);
      const { LoaiGhe, GiaVe } = priceResult.recordset[0];
      
      // Tạo vé
      const createTicketQuery = `
        INSERT INTO Ve (HoaDon_ID, SuatChieu_ID, Rap_ID, SoPhong, HangGhe, SoGhe, DonGiaLucBan, TrangThai)
        VALUES (@hoaDonId, @suatChieuId, @rapId, @soPhong, @hangGhe, @soGhe, @giaVe, 'DaThanhToan')
      `;
      
      createTicketRequest.input('giaVe', sql.Decimal(10, 2), GiaVe);
      await createTicketRequest.query(createTicketQuery);
      
      ticketTotal += parseFloat(GiaVe);
      ticketDetails.push({
        seatCode: `${seat.row}${seat.number}`,
        price: parseFloat(GiaVe),
        seatType: LoaiGhe
      });
    }
    
    let productTotal = 0;
    const productDetails = [];
    
    // Thêm sản phẩm vào hóa đơn
    if (products && products.length > 0) {
      for (const product of products) {
        const addProductRequest = new sql.Request(transaction);
        addProductRequest.input('hoaDonId', sql.Int, invoiceId);
        addProductRequest.input('productId', sql.Int, product.productId);
        addProductRequest.input('quantity', sql.Int, product.quantity);
        
        // Lấy thông tin sản phẩm
        const productQuery = `
          SELECT ID, TenSP, DonGia, TonKho
          FROM SanPham
          WHERE ID = @productId
        `;
        
        const productResult = await addProductRequest.query(productQuery);
        
        if (productResult.recordset.length === 0) {
          await transaction.rollback();
          return res.status(404).json({ message: `Sản phẩm ${product.productId} không tồn tại.` });
        }
        
        const productInfo = productResult.recordset[0];
        
        if (productInfo.TonKho < product.quantity) {
          await transaction.rollback();
          return res.status(400).json({ message: `Sản phẩm ${productInfo.TenSP} không đủ số lượng.` });
        }
        
        // Thêm sản phẩm vào hóa đơn
        const addProductQuery = `
          INSERT INTO HoaDon_SanPham (HoaDon_ID, SanPham_ID, SoLuong, DonGiaLucBan)
          VALUES (@hoaDonId, @productId, @quantity, @price)
        `;
        
        addProductRequest.input('price', sql.Decimal(10, 2), productInfo.DonGia);
        await addProductRequest.query(addProductQuery);
        
        // Cập nhật tồn kho
        const updateStockQuery = `
          UPDATE SanPham
          SET TonKho = TonKho - @quantity
          WHERE ID = @productId
        `;
        
        await addProductRequest.query(updateStockQuery);
        
        const itemTotal = parseFloat(productInfo.DonGia) * product.quantity;
        productTotal += itemTotal;
        productDetails.push({
          id: productInfo.ID,
          name: productInfo.TenSP,
          price: parseFloat(productInfo.DonGia),
          quantity: product.quantity
        });
      }
    }
    
    // Áp dụng voucher nếu có
    let discount = 0;
    let voucherInfo = null;
    
    if (voucherCode) {
      const voucherRequest = new sql.Request(transaction);
      voucherRequest.input('code', sql.VarChar(20), voucherCode);
      
      const voucherQuery = `
        SELECT ID, MaGiam, Loai, MucGiam, SoLuong
        FROM Voucher
        WHERE MaGiam = @code AND SoLuong > 0
      `;
      
      const voucherResult = await voucherRequest.query(voucherQuery);
      
      if (voucherResult.recordset.length > 0) {
        const voucher = voucherResult.recordset[0];
        const subtotal = ticketTotal + productTotal;
        
        if (voucher.Loai === 'PhanTram') {
          discount = subtotal * voucher.MucGiam / 100;
        } else {
          discount = voucher.MucGiam;
        }
        
        // Cập nhật voucher vào hóa đơn
        const updateVoucherQuery = `
          UPDATE HoaDon
          SET Voucher_ID = @voucherId
          WHERE ID = @hoaDonId
        `;
        
        voucherRequest.input('voucherId', sql.Int, voucher.ID);
        voucherRequest.input('hoaDonId', sql.Int, invoiceId);
        await voucherRequest.query(updateVoucherQuery);
        
        // Giảm số lượng voucher
        const decreaseVoucherQuery = `
          UPDATE Voucher
          SET SoLuong = SoLuong - 1
          WHERE ID = @voucherId
        `;
        
        await voucherRequest.query(decreaseVoucherQuery);
        
        voucherInfo = {
          id: voucher.ID,
          code: voucher.MaGiam,
          type: voucher.Loai
        };
      }
    }
    
    // Cộng điểm tích lũy cho khách hàng (nếu có)
    if (customerId) {
      const total = ticketTotal + productTotal - discount;
      const pointsToAdd = Math.floor(total / 1000); // 1 điểm cho mỗi 1000đ
      
      if (pointsToAdd > 0) {
        const updatePointsRequest = new sql.Request(transaction);
        updatePointsRequest.input('customerId', sql.Int, customerId);
        updatePointsRequest.input('points', sql.Int, pointsToAdd);
        
        const updatePointsQuery = `
          UPDATE KhachHang
          SET DiemTichLuy = DiemTichLuy + @points
          WHERE NguoiDung_ID = @customerId
        `;
        
        await updatePointsRequest.query(updatePointsQuery);
      }
    }
    
    await transaction.commit();
    
    const subtotal = ticketTotal + productTotal;
    const total = subtotal - discount;
    
    res.status(201).json({
      invoiceId: invoiceId,
      bookingCode: bookingCode,
      subtotal: subtotal,
      ticketTotal: ticketTotal,
      productTotal: productTotal,
      discount: discount,
      total: total,
      voucher: voucherInfo,
      tickets: ticketDetails,
      products: productDetails,
      showtime: {
        id: showtime.ID,
        rapId: showtime.Rap_ID,
        rapName: showtime.rapName,
        room: showtime.SoPhong,
        startTime: showtime.startTime,
        format: showtime.format,
        movieName: showtime.movieName
      }
    });
    
  } catch (err) {
    await transaction.rollback();
    console.error('Lỗi khi thanh toán:', err);
    res.status(500).json({ message: 'Lỗi server khi thanh toán: ' + err.message });
  }
});

module.exports = router;
