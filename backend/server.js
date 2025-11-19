const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./service/auth');
const movieRouter = require('./service/movie');
const userRouter = require('./service/users');
const showtimeRouter = require('./service/showtime');
const isLogin = require('./middle_wares/isLogin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Khuyến nghị chỉ định rõ nguồn gốc
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use(bodyParser.json());
app.use(express.json());

app.use('/auth', authRouter);

//app.use(isLogin); // Áp dụng middleware kiểm tra đăng nhập cho các route bên dưới mà đang bị sai

app.use('/phim', movieRouter);
app.use('/users', userRouter);
app.use('/suatchieu', showtimeRouter);

app.get('/', (req, res) => {
  res.send('Server đang chạy!');
});
const startServer = async () => {
  const { connectDB } = require('./service/db');
  await connectDB(); // Kết nối CSDL trước khi khởi động server
};

startServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi khi khởi động server:', err);
  });
