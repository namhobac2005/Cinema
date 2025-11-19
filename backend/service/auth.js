const express = require('express');
const { getPool, registerUser } = require('./db');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();

/**
 * API ĐĂNG KÝ
 * URL: POST /auth/register
 */
router.post('/register', async (req, res) => {
  // ⭐ Nhận các trường dữ liệu cần thiết cho đăng ký
  const { 
    hoTenDem, // ⭐ MỚI
    ten,      // ⭐ MỚI
    ngaySinh, // ⭐ MỚI
    soDienThoai, // ⭐ MỚI
    tenDangNhap, 
    matKhau 
  } = req.body; 

  // Validation phải được cập nhật tương ứng
  if (!hoTenDem || !ten || !ngaySinh || !soDienThoai || !tenDangNhap || !matKhau) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  try {
      // ⭐ CẬP NHẬT LỆNH GỌI HÀM SERVICE
      // Hàm registerUser phải được gọi với 6 tham số mới
      const result = await registerUser(hoTenDem, ten, ngaySinh, soDienThoai, tenDangNhap, matKhau);

      // Trả về thông báo thành công
      res.status(201).json({
          message: 'Đăng ký thành công. Vui lòng đăng nhập.',
          userId: result.userId,
      });

  } catch (err) {
      console.error('Lỗi đăng ký:', err);
      
      // Xử lý lỗi cụ thể (ví dụ: email đã tồn tại)
      if (err.message.includes('unique constraint')) { 
           return res.status(409).json({ message: 'Tên đăng nhập (email) này đã được sử dụng.' });
      }
      
      // Lỗi chung của server
      res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại.' });
  }
});

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
