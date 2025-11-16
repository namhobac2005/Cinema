const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./service/auth');
const movieRouter = require('./service/movie');
const userRouter = require('./service/users');
const showtimeRouter = require('./service/showtime');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/phim', movieRouter);
app.use('/users', userRouter);
app.use('/suatchieu', showtimeRouter);

app.get('/', (req, res) => {
  res.send('Server đang chạy!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
