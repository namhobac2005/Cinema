// service/auth.js
const express = require('express');
const { connectAsSManager } = require('./db'); // Import từ db.js
const router = express.Router();

/**
 * API ĐĂNG NHẬP
 * URL: POST /auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }
    // // (BTL yêu cầu đăng nhập bằng sManager)
    // if (username.toLowerCase() !== 'smanager') {
    //   return res.status(401).json({ message: 'Tài khoản không hợp lệ.' });
    // }

    // 2. Gọi Service (từ db.js) để xử lý kết nối
    await connectAsSManager(username, password);

    // 3. Trả về thành công
    res.status(200).json({ message: 'Đăng nhập thành công!' });
  } catch (err) {
    // 4. Bắt lỗi (từ db.js hoặc validation)
    res.status(401).json({ message: err.message });
  }
});

// Export router để server.js có thể dùng
module.exports = router;
