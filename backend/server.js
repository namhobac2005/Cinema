const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql'); // Bạn sẽ cần cái này
const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config(); // 1. Đọc file .env

// 2. IMPORT HÀM TỪ SERVICE (SỬA LẠI CHỖ NÀY)
// Hứng lấy hàm "login" mà file service đã export
const { Login } = require('./service/authService.js');

// 3. BIẾN GIỮ KẾT NỐI (appPool)
let appPool = null;

// 4. Khởi tạo server
const PORT = process.env.PORT || 5000;

// === TẠO CÁC API ROUTES ===

// Route cơ bản để biết server đang sống
app.get('/', (req, res) => {
  res.send('Server đang chạy!');
});

/**
 * API ĐĂNG NHẬP (BỔ SUNG PHẦN NÀY)
 */
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }
    if (username.toLowerCase() !== 'smanager') {
      return res.status(401).json({ message: 'Tài khoản không hợp lệ.' });
    }

    // 2. Gọi Service để xử lý
    const loginResult = await Login(username, password);

    // 3. Xử lý kết quả (tạo pool chính)
    if (loginResult.success) {
      if (appPool) await appPool.close();

      appPool = new sql.ConnectionPool(loginResult.config);
      await appPool.connect();
      console.log('Pool kết nối chính (sManager) đã sẵn sàng.');

      // 4. Trả về thành công
      res.status(200).json({ message: 'Đăng nhập thành công!' });
    }
  } catch (err) {
    // 5. Bắt lỗi (từ service)
    res.status(401).json({ message: err.message });
  }
});

// (Thêm các API khác như app.get('/phim', ...) ở đây)
// Nhớ là các API này phải kiểm tra "if (!appPool) { ... }"

// === KHỞI ĐỘNG SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
