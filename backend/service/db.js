// db.js
const sql = require('mssql');
require('dotenv').config();

let appPool = null; // Biến pool toàn cục

const connectDB = async () => {
  const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      trustServerCertificate: true,
    },
  };

  try {
    // Tạo pool MỘT LẦN
    appPool = new sql.ConnectionPool(config);
    await appPool.connect();
    console.log('Đã kết nối CSDL. Pool đã sẵn sàng.');
  } catch (err) {
    console.error('LỖI KẾT NỐI CSDL KHI KHỞI ĐỘNG:', err.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!appPool) {
    throw new Error('Pool CSDL chưa được khởi tạo! Hãy gọi connectDB() trước.');
  }
  return appPool;
};

// Export 2 hàm
module.exports = { connectDB, getPool };
