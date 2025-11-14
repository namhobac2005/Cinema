const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Import Routers ---
const authRouter = require('./service/auth');
const movieRouter = require('./service/movie');

// --- Gắn (Mount) Routers ---
// Mọi request /auth/... sẽ do authRouter xử lý
app.use('/auth', authRouter);

// Mọi request /phim/... sẽ do movieRouter xử lý
app.use('/phim', movieRouter);

// --- Routes cơ bản ---
app.get('/', (req, res) => {
  res.send('Server đang chạy!');
});

// === KHỞI ĐỘNG SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
