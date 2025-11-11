const sql = require('mssql');
require('dotenv').config();

const configTemplate = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
  trustServerCertificate: true,
};

async function Login(username, password) {
  const dynamicConfig = {
    ...configTemplate,
    user: username,
    password: password,
  };

  // TẠO POOL BẰNG dynamicConfig
  const pool = new sql.ConnectionPool(dynamicConfig);

  try {
    await pool.connect();
    await pool.close();

    return {
      success: true,
      config: dynamicConfig,
    };
  } catch (err) {
    if (pool) await pool.close();
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
  }
}

module.exports = { Login };
