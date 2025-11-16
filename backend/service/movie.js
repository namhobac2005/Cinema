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
// Thêm phim mới
router.post('/add', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    request.input('name', sql.NVarChar, req.body.name);
    request.input('description', sql.NVarChar, req.body.description);
    request.input('duration', sql.Int, req.body.duration);
    request.input('origin', sql.NVarChar, req.body.origin);
    request.input('type', sql.NVarChar, req.body.type);
    request.input('subtitles', sql.Bit, req.body.subtitles);
    request.input('dubbing', sql.Bit, req.body.dubbing);
    request.input('releaseDate', sql.Date, req.body.releaseDate);
    request.input('status', sql.NVarChar, req.body.status);
    request.input('TrailerURl', sql.NVarChar, req.body.TrailerURl);
    request.input('PosterURL', sql.NVarChar, req.body.PosterURL);
    request.input('AgeLimit', sql.Int, req.body.AgeLimit);
    const query = `
      INSERT INTO Phim (TenPhim, MoTa, ThoiLuong, XuatXu, DangPhim, PhuDe, LongTieng, NgayPhatHanh, TrangThaiPhim, TrailerURL, PosterURL, GioiHanTuoi)
      VALUES (@name, @description, @duration, @origin, @type, @subtitles, @dubbing, @releaseDate, @status, @TrailerURl, @PosterURL, @AgeLimit)`;

    await request.query(query);

    res.status(201).json({ message: 'Thêm phim thành công.' });
  } catch (err) {
    console.error('Lỗi khi thêm phim:', err);
    res.status(500).json({ message: 'Lỗi server khi thêm phim.' });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const movieId = req.params.id;
    const query = 'DELETE FROM Phim WHERE ID = @id';
    await request.input('id', sql.Int, movieId).query(query);
    res.status(200).json({ message: 'Xóa phim thành công.' });
  } catch (err) {
    console.error('Lỗi khi xóa phim:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa phim.' });
  }
});
// Cập nhật thông tin phim
router.put('/update/:id', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const { id } = req.params;
    const {
      name,
      description,
      duration,
      origin,
      type,
      subtitles,
      dubbing,
      releaseDate,
      status,
      TrailerURl,
      PosterURL,
      AgeLimit,
    } = req.body;

    request.input('id', sql.Int, id);
    request.input('name', sql.NVarChar, name);
    request.input('description', sql.NVarChar, description);
    request.input('duration', sql.Int, duration);
    request.input('origin', sql.NVarChar, origin);
    request.input('type', sql.NVarChar, type);
    request.input('subtitles', sql.Bit, subtitles);
    request.input('dubbing', sql.Bit, dubbing);
    request.input('releaseDate', sql.Date, releaseDate);
    request.input('status', sql.NVarChar, status);
    request.input('TrailerURl', sql.NVarChar, TrailerURl);
    request.input('PosterURL', sql.NVarChar, PosterURL);
    request.input('AgeLimit', sql.Int, AgeLimit);

    const query = ` UPDATE Phim
    SET TenPhim = @name,
        MoTa = @description,
        ThoiLuong = @duration,
        XuatXu = @origin,
        DangPhim = @type,
        PhuDe = @subtitles,
        LongTieng = @dubbing,
        NgayPhatHanh = @releaseDate,
        TrangThaiPhim = @status,
        TrailerURL = @TrailerURl,
        PosterURL = @PosterURL,
        GioiHanTuoi = @AgeLimit
    WHERE ID = @id `;
    await request.query(query);

    res.status(200).json({ message: 'Cập nhật phim thành công.' });
  } catch (err) {
    console.error('Lỗi khi cập nhật phim:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật phim.' });
  }
});
// cho suất chiếu
router.get('/list', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();

    const query = `
      SELECT 
        ID AS id, 
        TenPhim AS name 
      FROM 
        PHIM
      WHERE 
        TrangThaiPhim = 'DangChieu' OR TrangThaiPhim = 'SapChieu' -- Chỉ lấy phim có thể chiếu
      ORDER BY 
        TenPhim
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách phim (list):', err.message);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách phim' });
  }
});
module.exports = router;
