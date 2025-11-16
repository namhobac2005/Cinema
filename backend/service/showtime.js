const express = require('express');
const { getPool } = require('./db'); // Import hàm lấy Pool
const sql = require('mssql'); // Import thư viện mssql
const router = express.Router(); // Tạo một router mới
// Kiểm tra đăng nhập
router.use((req, res, next) => {
  try {
    getPool();
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Chưa đăng nhập. Vui lòng đăng nhập trước khi gọi API.',
    });
  }
});
router.get('/all', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const query = `
     SELECT 
        sc.ID AS id,
        sc.ThoiGianBatDau AS startTime,
        p.TenPhim AS movieName,
        pc.SoPhong AS roomName,
        r.TenRap AS cinemaName
    FROM 
        SuatChieu AS sc
    JOIN 
        Phim AS p ON sc.Phim_ID = p.ID
    JOIN 
        PhongChieu AS pc ON sc.SoPhong = pc.SoPhong AND pc.Rap_ID = sc.Rap_ID
    JOIN
        Rap AS r ON pc.Rap_ID = r.ID
    ORDER BY
      sc.ThoiGianBatDau DESC;`;
    const result = await request.query(query); // Thực thi truy vấn
    res.json(result.recordset); // Gửi kết quả về client
  } catch (err) {
    console.error('Lỗi khi lấy danh sách suất chiếu:', err);
    res
      .status(500)
      .json({ message: 'Lỗi server khi lấy danh sách suất chiếu.' });
  }
});

// xem rạp
router.get('/rap', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const query = `
    SELECT ID as cinemaId, TenRap AS cinemaName
    FROM Rap`;
    const result = await request.query(query); // Thực thi truy vấn
    res.json(result.recordset); // Gửi kết quả về client
  } catch (err) {
    console.error('Lỗi khi lấy danh sách rạp:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách rạp.' });
  }
});

// xem phòng chiếu theo rạp
router.get('/rap/:id/phongchieu/', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    request.input('cinemaId', sql.Int, req.params.id);
    const query = `
    SELECT SoPhong AS roomNo
    FROM PhongChieu
    WHERE Rap_ID = @cinemaId`;
    const result = await request.query(query); // Thực thi truy vấn
    res.json(result.recordset); // Gửi kết quả về client
  } catch (err) {
    console.error('Lỗi khi lấy danh sách phòng chiếu:', err);
    res
      .status(500)
      .json({ message: 'Lỗi server khi lấy danh sách phòng chiếu.' });
  }
});

//xem suất chiểu theo phòng chiếu
router.get('/rap/:cinemaId/phongchieu/:roomNo', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    request.input('cinemaId', sql.Int, req.params.cinemaId);
    request.input('roomNo', sql.NVarChar, req.params.roomNo);
    const query = `
    SELECT sc.ID AS showtimeId, sc.ThoiGianBatDau AS startTime, p.TenPhim AS movieName, sc.TrangThai AS status
    FROM SuatChieu AS sc
    JOIN Phim AS p ON sc.Phim_ID = p.ID
    WHERE sc.SoPhong = @roomNo AND sc.Rap_ID = @cinemaId`;
    const result = await request.query(query); // Thực thi truy vấn
    res.json(result.recordset); // Gửi kết quả về client
  } catch (err) {
    console.error('Lỗi khi lấy danh sách suất chiếu:', err);
    res
      .status(500)
      .json({ message: 'Lỗi server khi lấy danh sách suất chiếu.' });
  }
});

router.post('/add', async (req, res) => {
  const { MaPhim, MaPhong, MaRap, ThoiGianBatDau, GiaVe } = req.body;
  if (!MaPhim || !MaPhong || !MaRap || !ThoiGianBatDau) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
  }
  const pool = getPool();

  try {
    const movieRequest = pool.request();
    movieRequest.input('MaPhim', sql.Int, MaPhim);
    const movieResult = await movieRequest.query(
      'SELECT ThoiLuong FROM Phim WHERE ID = @MaPhim'
    );

    if (movieResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy Phim.' });
    }

    const duration = movieResult.recordset[0].ThoiLuong + 15; // + 15 phút dọn dẹp
    const newStartTime = new Date(ThoiGianBatDau);

    const insertRequest = pool.request();
    insertRequest.input('MaPhim', sql.Int, MaPhim);
    insertRequest.input('MaPhong', sql.NVarChar, MaPhong);
    insertRequest.input('MaRap', sql.Int, MaRap);
    insertRequest.input('ThoiGianBatDau', sql.DateTime, newStartTime);
    insertRequest.input('TrangThai', sql.NVarChar, 'DangMo');

    const insertQuery = `
      INSERT INTO SuatChieu (Phim_ID, SoPhong, Rap_ID, ThoiGianBatDau, TrangThai)
      VALUES (@MaPhim, @MaPhong, @MaRap, @ThoiGianBatDau, @TrangThai)
    `;

    await insertRequest.query(insertQuery);
    res.status(201).json({ message: 'Thêm suất chiếu thành công.' });
  } catch (err) {
    console.error('Lỗi khi thêm suất chiếu:', err.message);

    if (err.message.includes('TRG_SuatChieu_NoOverlap')) {
      return res.status(400).json({ message: 'Lỗi: Lịch chiếu bị trùng!' });
    }

    res.status(500).json({ message: 'Lỗi server khi thêm suất chiếu.' });
  }
});

module.exports = router;
