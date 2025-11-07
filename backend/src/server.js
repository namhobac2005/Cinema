const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config(); // 1. Đọc file .env
require('../config/db.js');

// 3. Khởi tạo server

const PORT = process.env.PORT || 5000;

// Route cơ bản để biết server đang sống
app.get('/', (req, res) => {
  res.send('Server đang chạy!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
