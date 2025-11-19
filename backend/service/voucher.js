const express = require('express');
const { getPool } = require('./db'); 
const sql = require('mssql'); 
const router = express.Router();

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

// API: GET /voucher/all
router.get('/all', async (req, res) => {
  try {
    const pool = getPool();
    const request = pool.request();
    const query = 'SELECT ID, MaGiam, Loai, MucGiam, SoLuong FROM Voucher';
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách voucher:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách voucher.' });
  }
});

/**
 * API: POST /voucher/add
 * {
 * "MaGiam": "HEVUI",
 * "Loai": "PhanTram",
 * "MucGiam": 15,
 * "SoLuong": 100
 * }
 */
router.post('/add', async (req, res) => {
  try {
    const { MaGiam, Loai, MucGiam, SoLuong } = req.body;

    // Validation 
    if (!MaGiam || !Loai || !MucGiam || SoLuong == null) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin MaGiam, Loai, MucGiam, SoLuong.' });
    }

    const pool = getPool();
    const request = pool.request();

    request.input('MaGiam', sql.VarChar, MaGiam);
    request.input('Loai', sql.VarChar, Loai);
    request.input('MucGiam', sql.Decimal(10, 2), MucGiam);
    request.input('SoLuong', sql.Int, SoLuong);

    const query = `
      INSERT INTO Voucher (MaGiam, Loai, MucGiam, SoLuong)
      VALUES (@MaGiam, @Loai, @MucGiam, @SoLuong)
    `;

    await request.query(query);
    res.status(201).json({ message: 'Tạo voucher thành công.' });
  } catch (err) {
    console.error('Lỗi khi tạo voucher:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo voucher.' });
  }
});

//API: PUT /voucher/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { MaGiam, Loai, MucGiam, SoLuong } = req.body;

    if (!MaGiam || !Loai || !MucGiam || SoLuong == null) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin MaGiam, Loai, MucGiam, SoLuong.' });
    }

    const pool = getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);
    request.input('MaGiam', sql.VarChar, MaGiam);
    request.input('Loai', sql.VarChar, Loai);
    request.input('MucGiam', sql.Decimal(10, 2), MucGiam);
    request.input('SoLuong', sql.Int, SoLuong);

    const query = `
      UPDATE Voucher
      SET MaGiam = @MaGiam,
          Loai = @Loai,
          MucGiam = @MucGiam,
          SoLuong = @SoLuong
      WHERE ID = @id
    `;

    await request.query(query);
    res.status(200).json({ message: 'Cập nhật voucher thành công.' });
  } catch (err) {
    console.error('Lỗi khi cập nhật voucher:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật voucher.' });
  }
});

// API: DELETE /voucher/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();
    const request = pool.request();

    request.input('id', sql.Int, id);

    const query = 'DELETE FROM Voucher WHERE ID = @id';

    await request.query(query);
    res.status(200).json({ message: 'Xóa voucher thành công.' });
  } catch (err) {
    if (err.number === 547) { // mã lỗi FK constraint
      return res.status(400).json({ message: 'Lỗi: Không thể xóa voucher này vì nó đã được sử dụng trong một hóa đơn.' });
    }
    console.error('Lỗi khi xóa voucher:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa voucher.' });
  }
});

module.exports = router; 