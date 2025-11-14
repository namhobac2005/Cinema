// db.js
const sql = require('mssql');
require('dotenv').config();

let appPool = null; // Biến pool toàn cục, được quản lý bởi module này

/**
 * Hàm này thử kết nối CSDL bằng user/pass được cung cấp.
 * Nếu thành công, nó sẽ tạo và lưu appPool.
 */
const connectAsSManager = async (username, password) => {
  // Đóng pool cũ nếu có
  if (appPool) {
    await appPool.close();
    appPool = null;
  }

  // Cấu hình cơ bản (đọc từ .env)
  const baseConfig = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    options: {
      // encrypt: true, // Bật nếu dùng Azure
      trustServerCertificate: true, // Bật nếu dùng
    },
  };

  // Cấu hình đăng nhập cụ thể
  const loginConfig = {
    ...baseConfig,
    user: username,
    password: password,
  };

  try {
    const pool = new sql.ConnectionPool(loginConfig);
    await pool.connect();

    appPool = pool; // Lưu pool nếu kết nối thành công
    console.log('Pool kết nối chính (sManager) đã sẵn sàng.');
    return { success: true, pool: appPool };
  } catch (err) {
    console.error('Lỗi kết nối CSDL:', err.message);
    // Ném lỗi ra để router /login bắt được
    throw new Error('Đăng nhập CSDL thất bại. Sai username hoặc password.');
  }
};

/**
 * Hàm này trả về pool CSDL hiện tại.
 * Các service khác (như movie.js) sẽ gọi hàm này.
 */
const getPool = () => {
  if (!appPool) {
    throw new Error('Chưa đăng nhập! Pool CSDL không có sẵn.');
  }
  return appPool;
};

// Export 2 hàm
module.exports = { connectAsSManager, getPool };
