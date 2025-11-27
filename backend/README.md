# 🚀 HỆ THỐNG QUẢN LÝ RẠP CHIẾU FILM - Backend

Đây là máy chủ API (Backend) cho dự án quản lý rạp chiếu phim. Nó được xây dựng bằng Node.js, Express và kết nối với cơ sở dữ liệu SQL Server.

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework**: Node.js
- **Server**: Express (`^5.1.0`)
- **Database Connector**: mssql (`^12.1.0`)
- **Development Tool**: Nodemon (`^3.1.10`) - Giúp server tự động khởi động lại khi có thay đổi code.

## 🏃 Bắt đầu nhanh (Getting Started)

Phần dưới đây là hướng dẫn chạy Backend.

### Yêu cầu

- Node.js (phiên bản 18+)
- npm / yarn
- Một CSDL SQL Server đang chạy (ví dụ: trên `localhost`).
- Bạn cần có thông tin đăng nhập (user, password) và tên database.

### Cài đặt & Chạy

1.  **Clone repository (Nếu bạn chưa làm ở bước Frontend):**

    ```bash
    git clone [https://github.com/namhobac2005/Cinema.git](https://github.com/namhobac2005/Cinema.git)
    ```

2.  **Di chuyển vào thư mục Backend:**

    ```bash
    cd Cinema/backend
    ```

3.  **Cài đặt các gói phụ thuộc (dependencies):**
    _(Lệnh này sẽ cài Express, mssql, nodemon...)_

    ```bash
    npm install
    ```

4.  **Quan trọng: Cấu hình kết nối Database**

    - Mở folder `/src`.
    - Tạo lại .env và **sửa lại thông tin** `DB_SERVER`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD` và `DB_PORT` cho khớp với CSDL SQL Server của mình.

    .env
    DB_SERVER = LAPTOP-`laptop của mình`\SQLEXPRESS
    DB_DATABASE = DB_Name --tự đặt
    DB_USER = my_user --tự tạo
    DB_PASSWORD = 1234 --tự tạo
    DB_PORT = 1433 --mặc định

    TMDB_API_KEY=your_actual_api_key_here --xem chi tiết trong TMDB_SETUP.md

    ```

    ```

5.  **Chạy dự án (chế độ development):**

    ```bash
    npm run dev
    ```

6.  Nếu cấu hình chính xác, server sẽ khởi động và báo "Đã kết nối thành công với SQL Server" và chạy tại `http://localhost:5000`

## 📡 API Endpoints (Ví dụ)

---

_(Sẽ cập nhật thêm các API routes khác...)_
