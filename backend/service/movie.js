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
    const querry = `
     SELECT ID AS id,        
    TenPhim AS name,        
    MoTa AS description,   
    ThoiLuong AS duration,  
    XuatXu AS origin,       
    DangPhim AS type, 
    PhuDe AS subtitles, 
    LongTieng AS dubbing, 
    NgayPhatHanh AS releaseDate, 
    TrangThaiPhim AS status, 
    TrailerURL AS TrailerURl, 
    PosterURL AS PosterURL, 
    GioiHanTuoi AS AgeLimit
    FROM Phim`;
    const result = await request.query(querry); // Thực thi truy vấn
    res.json(result.recordset); // Gửi kết quả về client
  } catch (err) {
    console.error('Lỗi khi lấy danh sách phim:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách phim.' });
  }
});
module.exports = router;
