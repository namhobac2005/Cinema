# TMDB API Integration Guide

## Lấy TMDB API Key

1. Truy cập [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Đăng ký tài khoản miễn phí nếu chưa có
3. Đăng nhập và vào **Settings** → **API**
4. Chọn **Create** hoặc **Request an API Key**
5. Chọn loại **Developer** (miễn phí)
6. Điền thông tin ứng dụng của bạn
7. Chấp nhận điều khoản sử dụng
8. Copy **API Key (v3 auth)** 

## Cấu hình

1. Mở file `.env` trong thư mục `backend`
2. Thêm TMDB API key vào:
   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

## Tính năng

### Backend API Endpoints

- **GET /tmdb/search?query={movie_name}** - Tìm kiếm phim trên TMDB
- **GET /tmdb/movie/:tmdbId** - Lấy chi tiết phim và trailer
- **GET /tmdb/popular** - Lấy danh sách phim phổ biến

### Frontend Features

- **Hiển thị Poster chất lượng cao** từ TMDB
- **Xem Trailer** trực tiếp trong ứng dụng
- **Rating** từ cộng đồng TMDB
- **Mô tả phim** chi tiết bằng tiếng Việt

## Cách hoạt động

1. Khi người dùng chọn rạp, hệ thống tải danh sách phim từ database
2. Với mỗi phim, hệ thống tự động tìm kiếm thông tin từ TMDB theo tên phim
3. Poster, trailer, và mô tả sẽ được lấy từ TMDB (nếu có)
4. Nếu không tìm thấy trên TMDB, sử dụng dữ liệu từ database

## Lưu ý

- TMDB API miễn phí có giới hạn 40 requests/10 giây
- Nên cache kết quả để tránh vượt quá giới hạn
- API key cần được bảo mật, không commit vào Git
