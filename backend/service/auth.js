const express = require('express');
const { getPool } = require('./db');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();

/**
 * API ĐĂNG NHẬP
 * URL: POST /auth/login
 */
router.post('/login', async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;

  if (!tenDangNhap || !matKhau) {
    return res
      .status(400)
      .json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
  }

  try {
    const pool = await getPool();
    const response = await pool
      .request()
      .input('TenDangNhap', sql.NVarChar, tenDangNhap)
      .input('MatKhau', sql.NVarChar, matKhau)
      .execute('sp_DangNhap');

    if (response.recordset.length === 0) {
      return res
        .status(401)
        .json({ message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }
    const user = response.recordset[0];

    const token = jwt.sign(
      {
        id: user.NguoiDung_ID,
        role: user.VaiTro,
      },
      'BI_MAT_CUA_BAN',
      { expiresIn: '2s' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user.NguoiDung_ID,
        ten: user.Ten,
        email: user.Email,
        phoneNum: user.SoDienThoai,
        vaiTro: user.VaiTro,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

module.exports = router;
