/*
===============================================================
    SCRIPT CHÈN DỮ LIỆU ĐẦY ĐỦ CHO BOOKING FLOW
    - Nhiều phim DangChieu
    - Suất chiếu trong tương lai (KHÔNG TRÙNG LẮP)
    - Đủ ghế cho mỗi phòng (50 ghế/phòng)
===============================================================
*/

USE Cinema;
GO

PRINT 'Bat dau chen du lieu day du...';

-- 1) NguoiDung
PRINT 'Dang chen: NguoiDung';
INSERT INTO NguoiDung (HovaTendem, Ten, NgaySinh, VaiTro, SoDienThoai, Email, MatKhau)
VALUES
    (N'Nguyễn Văn', N'An', '1990-05-15', 'KhachHang', '0900000001', 'an.nguyen@email.com', 'hashed_pass_1'),
    (N'Trần Thị', N'Bình', '1995-11-20', 'KhachHang', '0900000002', 'binh.tran@email.com', 'hashed_pass_2'),
    (N'Lê Minh', N'Chiến', '2000-01-01', 'KhachHang', '0900000003', 'chien.le@email.com', 'hashed_pass_3'),
    (N'Phạm Hùng', N'Dũng', '1988-02-10', 'KhachHang', '0900000004', NULL, NULL),
    (N'Võ Thị', N'Em', '2001-07-22', 'KhachHang', '0900000005', 'em.vo@email.com', 'hashed_pass_5'),
    (N'Đặng Văn', N'Phúc', '1992-04-19', 'KhachHang', '0900000006', 'phuc.dang@email.com', 'hashed_pass_6'),
    (N'Hoàng Minh', N'Giang', '1997-12-30', 'KhachHang', '0900000007', 'giang.hoang@email.com', 'hashed_pass_7'),
    (N'Bùi Thị', N'Hương', '1999-08-14', 'KhachHang', '0900000008', 'huong.bui@email.com', 'hashed_pass_8'),
    (N'Ngô Tuấn', N'Kiệt', '1993-03-05', 'KhachHang', '0900000009', 'kiet.ngo@email.com', 'hashed_pass_9'),
    (N'Dương Văn', N'Long', '1998-06-11', 'KhachHang', '0900000010', 'long.duong@email.com', 'hashed_pass_10'),
    (N'Trịnh Quốc', N'Tuấn', '1990-09-08', 'QuanLy', '0910000001', 'manager.tuan@cinema.com', 'hashed_pass_manager'),
    (N'Lý Thị', N'Mai', '1994-04-12', 'NhanVien', '0910000002', 'mai.ly@cinema.com', 'hashed_pass_nv1'),
    (N'Đỗ Hùng', N'Sơn', '1985-10-25', 'NhanVien', '0910000003', NULL, NULL),
    (N'Vũ Minh', N'Tâm', '1998-02-02', 'NhanVien', '0910000004', 'tam.vu@cinema.com', 'hashed_pass_nv2'),
    (N'Hồ Thị', N'Thu', '1996-07-16', 'NhanVien', '0910000005', NULL, NULL),
    (N'Lâm Văn', N'Bảo', '2000-01-29', 'NhanVien', '0910000006', NULL, NULL),
    (N'Chu Đức', N'Việt', '1991-11-11', 'NhanVien', '0910000007', NULL, NULL),
    (N'Phan Thị', N'Quỳnh', '1997-05-07', 'NhanVien', '0910000008', 'quynh.phan@cinema.com', 'hashed_pass_nv3'),
    (N'Mai Tiến', N'Đạt', '1995-03-18', 'NhanVien', '0910000009', NULL, NULL),
    (N'Trần Văn', N'Hoàng', '1993-08-21', 'NhanVien', '0910000010', NULL, NULL);
GO

-- 2) SanPham
PRINT 'Dang chen: SanPham';
INSERT INTO SanPham (TenSP, DonGia, TonKho, PhanLoai, NhaPhanPhoi)
VALUES
    (N'Bắp rang bơ vị Phô Mai (Lớn)', 79000, 100, 'ThucAn', N'CP Foods'),
    (N'Bắp rang bơ vị Caramel (Lớn)', 79000, 100, 'ThucAn', N'CP Foods'),
    (N'Khoai tây chiên (Lớn)', 55000, 80, 'ThucAn', N'Vinafood'),
    (N'Xúc xích Đức', 45000, 120, 'ThucAn', N'Vissan'),
    (N'Hotdog Phô Mai', 50000, 70, 'ThucAn', N'Vissan'),
    (N'Gà rán (2 miếng)', 65000, 50, 'ThucAn', N'KFC'),
    (N'Bánh mì que', 30000, 150, 'ThucAn', N'ABC Bakery'),
    (N'Bắp rang bơ (Nhỏ)', 59000, 100, 'ThucAn', N'CP Foods'),
    (N'Snack Oishi', 25000, 200, 'ThucAn', N'Oishi'),
    (N'Bánh gạo One One', 35000, 150, 'ThucAn', N'One One'),
    (N'Coca-Cola (Lớn)', 45000, 500, 'NuocUong', N'Coca-Cola VN'),
    (N'Pepsi (Lớn)', 45000, 500, 'NuocUong', N'Suntory Pepsico'),
    (N'7 Up (Lớn)', 45000, 450, 'NuocUong', N'Suntory Pepsico'),
    (N'Nước suối Aquafina', 20000, 1000, 'NuocUong', N'Suntory Pepsico'),
    (N'Trà chanh Lipton', 35000, 300, 'NuocUong', N'Unilever'),
    (N'Nước cam ép Twister', 40000, 250, 'NuocUong', N'Suntory Pepsico'),
    (N'Trà sữa Nestea', 50000, 150, 'NuocUong', N'Nestle'),
    (N'Sprite (Lớn)', 45000, 400, 'NuocUong', N'Coca-Cola VN'),
    (N'Fanta (Lớn)', 45000, 350, 'NuocUong', N'Coca-Cola VN'),
    (N'Nước tăng lực Redbull', 30000, 200, 'NuocUong', N'Redbull VN'),
    (N'Combo 1 (1 Bắp + 1 Nước)', 110000, 100, 'Combo', N'Cinema'),
    (N'Combo 2 (1 Bắp + 2 Nước)', 150000, 100, 'Combo', N'Cinema'),
    (N'Combo Hotdog (1 Hotdog + 1 Nước)', 85000, 80, 'Combo', N'Cinema'),
    (N'Combo Couple (2 Bắp + 2 Nước)', 200000, 50, 'Combo', N'Cinema'),
    (N'Combo Gia đình (2 Bắp Lớn + 4 Nước)', 299000, 30, 'Combo', N'Cinema'),
    (N'Combo Phim hành động (1 Bắp + 1 Redbull)', 99000, 70, 'Combo', N'Cinema'),
    (N'Combo Tiết kiệm (1 Bắp nhỏ + 1 Nước)', 95000, 100, 'Combo', N'Cinema'),
    (N'Combo Gà rán (Gà + Nước)', 99000, 50, 'Combo', N'Cinema'),
    (N'Combo Khoai tây (Khoai + Nước)', 89000, 60, 'Combo', N'Cinema'),
    (N'Combo Bạn bè (4 Nước + 2 Bắp)', 280000, 40, 'Combo', N'Cinema');
GO

-- 9) Phim
PRINT 'Dang chen: Phim';
INSERT INTO Phim (TenPhim, MoTa, ThoiLuong, XuatXu, DangPhim, NgayPhatHanh, PhuDe, LongTieng, TrangThaiPhim, TrailerURL, PosterURL, GioiHanTuoi)
VALUES
    (N'Đào, Phở và Piano', N'Phim lịch sử về Hà Nội 1946', 120, N'Việt Nam', '2D', '2024-02-10', N'Tiếng Anh', N'Tiếng Việt', 'DangChieu', 'url/trailer1', 'url/poster1', 13),
    (N'Lật Mặt 7: Một Điều Ước', N'Phim của Lý Hải', 135, N'Việt Nam', '2D', '2024-04-26', NULL, N'Tiếng Việt', 'DangChieu', 'url/trailer2', 'url/poster2', 13),
    (N'Inside Out 2', N'Những cảm xúc mới', 96, N'Mỹ', '3D', '2024-06-14', N'Tiếng Việt', N'Tiếng Việt', 'DangChieu', 'url/trailer5', 'url/poster5', 0),
    (N'Furiosa: A Mad Max Saga', N'Tiền truyện của Mad Max', 148, N'Mỹ', '4DX', '2024-05-24', N'Tiếng Việt', NULL, 'DangChieu', 'url/trailer6', 'url/poster6', 18),
    (N'Deadpool & Wolverine', N'Bom tấn siêu anh hùng', 127, N'Mỹ', 'IMAX', '2024-07-26', N'Tiếng Việt', NULL, 'DangChieu', 'url/trailer11', 'url/poster11', 18),
    (N'A Quiet Place: Day One', N'Ngày đầu tiên của thảm họa', 99, N'Mỹ', '2D', '2024-06-28', N'Tiếng Việt', NULL, 'DangChieu', 'url/trailer12', 'url/poster12', 16),
    (N'Dune: Part Two', N'Hành trình của Paul Atreides', 166, N'Mỹ', 'IMAX', '2024-03-01', N'Tiếng Việt', NULL, 'NgungChieu', 'url/trailer3', 'url/poster3', 16),
    (N'Godzilla x Kong: The New Empire', N'Quái vật đại chiến', 115, N'Mỹ', '3D', '2024-03-29', N'Tiếng Việt', NULL, 'NgungChieu', 'url/trailer4', 'url/poster4', 13),
    (N'Oppenheimer', N'Cha đẻ bom nguyên tử', 180, N'Mỹ', 'IMAX', '2023-08-11', N'Tiếng Việt', NULL, 'NgungChieu', 'url/trailer8', 'url/poster8', 18),
    (N'Exhuma: Quật Mộ Trùng Ma', N'Phim kinh dị Hàn Quốc', 134, N'Hàn Quốc', '2D', '2024-03-15', N'Tiếng Việt', NULL, 'NgungChieu', 'url/trailer9', 'url/poster9', 16);
GO

-- 13) Rap
PRINT 'Dang chen: Rap';
INSERT INTO Rap (TenRap, DiaChi, Hotline, TrangThai)
VALUES
    (N'Cinema Sư Vạn Hạnh', N'11 Sư Vạn Hạnh, P.12, Q.10, TPHCM', '19000001', 'HoatDong'),
    (N'Cinema Giga Mall', N'Tầng 6, TTTM Giga Mall, 242 Phạm Văn Đồng, Thủ Đức, TPHCM', '19000002', 'HoatDong'),
    (N'Cinema Hùng Vương', N'Tầng 7, TTTM Hùng Vương Plaza, 126 Hùng Vương, P.12, Q.5, TPHCM', '19000003', 'HoatDong'),
    (N'Cinema Vincom Royal City', N'Tầng B2, TTTM Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội', '19000004', 'HoatDong'),
    (N'Cinema Vincom Times City', N'Tầng B1, TTTM Vincom Mega Mall Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội', '19000005', 'BaoTri'),
    (N'Cinema Landmark 81', N'Tầng B1, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Q.Bình Thạnh, TPHCM', '19000006', 'HoatDong'),
    (N'Cinema Aeon Mall Tân Phú', N'Tầng 3, TTTM Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, Q.Tân Phú, TPHCM', '19000007', 'HoatDong'),
    (N'Cinema Đà Nẵng', N'Tầng 4, TTTM Vincom Plaza Ngô Quyền, 910A Ngô Quyền, Sơn Trà, Đà Nẵng', '19000008', 'HoatDong'),
    (N'Cinema Cần Thơ', N'Tầng 3, TTTM Sense City, 1 Đại lộ Hòa Bình, Ninh Kiều, Cần Thơ', '19000009', 'TamDong'),
    (N'Cinema Hải Phòng', N'Tầng 5, TTTM Vincom Plaza Imperia, P. Thượng Lý, Hồng Bàng, Hải Phòng', '19000010', 'HoatDong');
GO

-- 17) GiaVe
PRINT 'Dang chen: GiaVe';
INSERT INTO GiaVe (LoaiGhe, LoaiSuatChieu, DinhDangPhim, DonGia, NgayBatDauApDung, NgayKetThucApDung, TrangThai)
VALUES
    -- 2D - Ngày thường
    ('Thuong', 'NgayThuong', '2D', 80000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'NgayThuong', '2D', 100000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'NgayThuong', '2D', 160000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- 2D - Cuối tuần
    ('Thuong', 'CuoiTuan', '2D', 110000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'CuoiTuan', '2D', 130000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'CuoiTuan', '2D', 220000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- 3D - Ngày thường
    ('Thuong', 'NgayThuong', '3D', 120000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'NgayThuong', '3D', 140000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'NgayThuong', '3D', 240000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- 3D - Cuối tuần
    ('Thuong', 'CuoiTuan', '3D', 150000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'CuoiTuan', '3D', 170000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'CuoiTuan', '3D', 300000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- IMAX - Ngày thường
    ('Thuong', 'NgayThuong', 'IMAX', 180000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'NgayThuong', 'IMAX', 220000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'NgayThuong', 'IMAX', 360000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- IMAX - Cuối tuần
    ('Thuong', 'CuoiTuan', 'IMAX', 220000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'CuoiTuan', 'IMAX', 260000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'CuoiTuan', 'IMAX', 440000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- 4DX - Ngày thường
    ('Thuong', 'NgayThuong', '4DX', 200000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'NgayThuong', '4DX', 240000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'NgayThuong', '4DX', 400000, '2024-01-01', NULL, 'ConHieuLuc'),
    
    -- 4DX - Cuối tuần
    ('Thuong', 'CuoiTuan', '4DX', 250000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('VIP', 'CuoiTuan', '4DX', 290000, '2024-01-01', NULL, 'ConHieuLuc'),
    ('Doi', 'CuoiTuan', '4DX', 500000, '2024-01-01', NULL, 'ConHieuLuc');
GO

-- 21) Voucher
PRINT 'Dang chen: Voucher';
INSERT INTO Voucher (MaGiam, Loai, MucGiam, SoLuong)
VALUES
    ('XINCHAO', 'PhanTram', 10, 30),
    ('HE2024', 'SoTien', 50000,30),
    ('MIDCREDIT', 'PhanTram', 50, 20),
    ('BUOI TOI VUI VE', 'SoTien', 30000, 30),
    ('TIX123', 'PhanTram', 20, 30), 
    ('KM_NEWBIE', 'SoTien', 100000, 30),
    ('FREESHIP', 'SoTien', 15000, 30),
    ('LOVEU', 'PhanTram', 15, 30),
    ('VIPMEMBER', 'PhanTram', 25, 30),
    ('HAPPYDAY', 'SoTien', 20000, 30);
GO

---
-- LEVEL 1
---

PRINT 'Dang chen: KhachHang';
INSERT INTO KhachHang (NguoiDung_ID, DiemTichLuy)
VALUES
    (1, 100), (2, 1500), (3, 5500), (4, 0), (5, 2300),
    (6, 50), (7, 800), (8, 3000), (9, 10000), (10, 120);
GO

PRINT 'Dang chen: NhanVien';
INSERT INTO NhanVien (NguoiDung_ID, NgayVaoLam, LuongCoBan)
VALUES
    (11, '2020-01-01', 8000000), (12, '2021-05-15', 7500000),
    (13, '2018-11-10', 12000000), (14, '2022-03-20', 7000000),
    (15, '2021-07-01', 7500000), (16, '2023-02-05', 6500000),
    (17, '2019-08-19', 10000000), (18, '2022-12-11', 7000000),
    (19, '2020-06-30', 9000000), (20, '2021-04-14', 8500000);
GO

PRINT 'Dang chen: ThucAn';
INSERT INTO ThucAn (SanPham_ID, TrongLuong, Vi)
VALUES
    (1, N'Lớn', N'Phô Mai'), (2, N'Lớn', N'Caramel'), (3, N'Lớn', N'Mặn'),
    (4, N'80g', N'Xông khói'), (5, N'100g', N'Phô Mai'), (6, N'200g', N'Giòn cay'),
    (7, N'50g', N'Bơ tỏi'), (8, N'Nhỏ', N'Mặn'), (9, N'40g', N'Tôm cay'), (10, N'100g', N'Mặn');
GO

PRINT 'Dang chen: NuocUong';
INSERT INTO NuocUong (SanPham_ID, TheTich, CoGas)
VALUES
    (11, N'32oz (Lớn)', 1), (12, N'32oz (Lớn)', 1), (13, N'32oz (Lớn)', 1),
    (14, N'500ml', 0), (15, N'500ml', 0), (16, N'400ml', 0), (17, N'450ml', 0),
    (18, N'32oz (Lớn)', 1), (19, N'32oz (Lớn)', 1), (20, N'250ml', 1);
GO

PRINT 'Dang chen: Combo';
INSERT INTO Combo (SanPham_ID, MoTa)
VALUES
    (21, N'1 Bắp Lớn + 1 Nước Lớn'),
    (22, N'1 Bắp Lớn + 2 Nước Lớn'),
    (23, N'1 Hotdog Phô Mai + 1 Nước Lớn'),
    (24, N'2 Bắp Lớn + 2 Nước Lớn (Tự chọn vị)'),
    (25, N'2 Bắp Lớn (Tự chọn) + 4 Nước Lớn (Tự chọn)'),
    (26, N'1 Bắp Lớn + 1 Lon Redbull'),
    (27, N'1 Bắp Nhỏ + 1 Nước Lớn'),
    (28, N'2 Miếng gà + 1 Nước Lớn'),
    (29, N'1 Khoai tây chiên Lớn + 1 Nước Lớn'),
    (30, N'4 Nước Lớn + 2 Bắp Lớn');
GO

PRINT 'Dang chen: DienVien, DaoDien, LoaiPhim';
INSERT INTO DienVien (Phim_ID, TenDienVien)
VALUES
    (1, N'Doãn Hoàng Phúc'), (1, N'Trần Nghĩa'),
    (2, N'Lý Hải'), (2, N'Trương Minh Cường'),
    (3, N'Amy Poehler'), (4, N'Anya Taylor-Joy'), (4, N'Chris Hemsworth'),
    (5, N'Ryan Reynolds'), (5, N'Hugh Jackman'),
    (6, N'Lupita Nyongo');
GO

INSERT INTO DaoDien (Phim_ID, TenDaoDien)
VALUES
    (1, N'Phi Tiến Sơn'), (2, N'Lý Hải'), (3, N'Kelsey Mann'),
    (4, N'George Miller'), (5, N'Shawn Levy'), (6, N'Michael Sarnoski');
GO

INSERT INTO LoaiPhim (Phim_ID, TenLoaiPhim)
VALUES
    (1, N'Lịch sử'), (1, N'Chiến tranh'), (2, N'Gia đình'),
    (3, N'Hoạt hình'), (4, N'Hành động'), (5, N'Hành động'), (5, N'Hài'),
    (6, N'Kinh dị'), (6, N'Khoa học viễn tưởng');
GO

-- 14) PhongChieu
PRINT 'Dang chen: PhongChieu';
INSERT INTO PhongChieu (Rap_ID, SoPhong, SucChua, LoaiPhong, TrangThai)
VALUES
    (1, 'P01', 50, '2D', 'HoatDong'),
    (1, 'P02', 50, '3D', 'HoatDong'),
    (1, 'P03', 50, 'IMAX', 'HoatDong'),
    (2, 'P01', 50, '2D', 'HoatDong'),
    (2, 'P02', 50, '4DX', 'HoatDong'),
    (3, 'P01', 50, '2D', 'HoatDong'),
    (3, 'P02', 50, '3D', 'HoatDong'),
    (4, 'P01', 50, 'IMAX', 'HoatDong'),
    (6, 'P01', 50, '4DX', 'HoatDong'),
    (7, 'P01', 50, '2D', 'HoatDong'),
    (7, 'P02', 50, '3D', 'HoatDong'),
    (7, 'P03', 50, 'IMAX', 'HoatDong');
GO

PRINT 'Dang chen: HoaDon';
INSERT INTO HoaDon (ThoiGianTao, TrangThaiThanhToan, PhuongThucThanhToan, KhachHang_ID, NhanVien_ID, Voucher_ID)
VALUES
    ('2025-11-14T10:30:00', 'DaThanhToan', 'Momo', 1, NULL, NULL),
    ('2025-11-14T11:00:00', 'DaThanhToan', 'ZaloPay', 2, NULL, NULL),
    ('2025-11-14T12:15:00', 'ChuaThanhToan', NULL, 3, NULL, NULL),
    ('2025-11-14T14:00:00', 'DaThanhToan', 'TienMat', NULL, 11, NULL),
    ('2025-11-14T15:30:00', 'DaHuy', NULL, 4, NULL, NULL),
    ('2025-11-15T09:00:00', 'DaThanhToan', 'VNPAY', 5, NULL, NULL),
    ('2025-11-15T10:00:00', 'DaThanhToan', 'TienMat', NULL, 12, NULL),
    ('2025-11-15T11:00:00', 'DaThanhToan', 'TheTinDung', 6, NULL, NULL),
    ('2025-11-15T13:00:00', 'ChuaThanhToan', NULL, 7, NULL, NULL),
    ('2025-11-15T14:00:00', 'DaThanhToan', 'Momo', 8, NULL, NULL);
GO

---
-- LEVEL 2
---

PRINT 'Dang chen: Combo_SanPham';
INSERT INTO Combo_SanPham (Combo_ID, SanPhamCon_ID, SoLuong)
VALUES
    (21, 2, 1), (21, 11, 1), (22, 1, 1), (22, 11, 2),
    (23, 5, 1), (23, 12, 1), (24, 2, 2), (24, 11, 2),
    (28, 6, 1), (28, 13, 1);
GO

-- ⭐ 15) Ghe - Tạo 50 ghế cho mỗi phòng (5 hàng x 10 ghế)
-- Logic: Hàng A,B,C = Thường | Hàng D = VIP | Hàng E = Đôi
PRINT 'Dang chen: Ghe (50 ghe/phong - Optimized)';

-- Tạo ghế cho tất cả các phòng (12 phòng)
DECLARE @RapGhe INT, @PhongGhe VARCHAR(10), @HangGhe CHAR(1), @SoGheNum INT;

-- Danh sách tất cả phòng chiếu
DECLARE @AllRooms TABLE (RapID INT, SoPhong VARCHAR(10));
INSERT INTO @AllRooms SELECT Rap_ID, SoPhong FROM PhongChieu;

-- Cursor cho từng phòng
DECLARE room_cursor CURSOR FOR SELECT RapID, SoPhong FROM @AllRooms;
OPEN room_cursor;
FETCH NEXT FROM room_cursor INTO @RapGhe, @PhongGhe;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Tạo ghế cho 5 hàng (A, B, C, D, E), mỗi hàng 10 ghế
    SET @HangGhe = 'A';
    WHILE @HangGhe <= 'E'
    BEGIN
        SET @SoGheNum = 1;
        WHILE @SoGheNum <= 10
        BEGIN
            INSERT INTO Ghe (Rap_ID, SoPhong, HangGhe, SoGhe, LoaiGhe)
            VALUES (
                @RapGhe,
                @PhongGhe,
                @HangGhe,
                CAST(@SoGheNum AS VARCHAR(5)),
                CASE 
                    WHEN @HangGhe = 'E' THEN 'Doi'      -- Hàng E: Ghế Đôi
                    WHEN @HangGhe = 'D' THEN 'VIP'      -- Hàng D: Ghế VIP
                    ELSE 'Thuong'                        -- Hàng A,B,C: Ghế Thường
                END
            );
            SET @SoGheNum = @SoGheNum + 1;
        END
        SET @HangGhe = CHAR(ASCII(@HangGhe) + 1);
    END
    
    FETCH NEXT FROM room_cursor INTO @RapGhe, @PhongGhe;
END

CLOSE room_cursor;
DEALLOCATE room_cursor;
GO

-- ⭐ 16) SuatChieu - SỬA: Tạo suất chiếu KHÔNG TRÙNG LẮP
PRINT 'Dang chen: SuatChieu (khong trung lap)';

/*
Logic tạo suất chiếu:
- Phim 1 (Đào, Phở và Piano): 120 phút = 2h
- Phim 2 (Lật Mặt 7): 135 phút = 2h15
- Phim 3 (Inside Out 2): 96 phút = 1h36
- Phim 4 (Furiosa): 148 phút = 2h28
- Phim 5 (Deadpool): 127 phút = 2h07
- Phim 6 (A Quiet Place): 99 phút = 1h39

Mỗi suất chiếu cách nhau ít nhất: ThoiLuongPhim + 15 phút dọn dẹp
*/

INSERT INTO SuatChieu (ThoiGianBatDau, Phim_ID, Rap_ID, SoPhong, TrangThai)
VALUES
    -- ===== RẠP 7 (Aeon Mall) - P01 (2D) =====
    -- Phim 1 (120p): 10:00 -> 12:00, 14:30 -> 16:30, 19:00 -> 21:00
    ('2025-11-26T10:00:00', 1, 7, 'P01', 'DangMo'),
    ('2025-11-26T14:30:00', 1, 7, 'P01', 'DangMo'),
    ('2025-11-26T19:00:00', 1, 7, 'P01', 'DangMo'),
    
    -- ===== RẠP 7 (Aeon Mall) - P02 (3D) =====
    -- Phim 3 (96p): 10:00 -> 11:36, 14:00 -> 15:36, 17:00 -> 18:36, 20:00 -> 21:36
    ('2025-11-26T10:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-26T14:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-26T17:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-26T20:00:00', 3, 7, 'P02', 'DangMo'),
    
    -- ===== RẠP 7 (Aeon Mall) - P03 (IMAX) =====
    -- Phim 5 (127p): 10:00 -> 12:07, 14:30 -> 16:37, 19:00 -> 21:07
    ('2025-11-26T10:00:00', 5, 7, 'P03', 'DangMo'),
    ('2025-11-26T14:30:00', 5, 7, 'P03', 'DangMo'),
    ('2025-11-26T19:00:00', 5, 7, 'P03', 'DangMo'),
    
    -- ===== RẠP 1 (Sư Vạn Hạnh) - P01 (2D) =====
    ('2025-11-26T10:00:00', 1, 1, 'P01', 'DangMo'),
    ('2025-11-26T14:30:00', 6, 1, 'P01', 'DangMo'),
    ('2025-11-26T18:00:00', 1, 1, 'P01', 'DangMo'),
    ('2025-11-26T22:00:00', 6, 1, 'P01', 'DangMo'),
    
    -- ===== RẠP 1 (Sư Vạn Hạnh) - P02 (3D) =====
    ('2025-11-26T10:00:00', 3, 1, 'P02', 'DangMo'),
    ('2025-11-26T14:00:00', 3, 1, 'P02', 'DangMo'),
    ('2025-11-26T17:00:00', 3, 1, 'P02', 'DangMo'),
    ('2025-11-26T20:00:00', 3, 1, 'P02', 'DangMo'),
    
    -- ===== RẠP 1 (Sư Vạn Hạnh) - P03 (IMAX) =====
    ('2025-11-26T10:00:00', 5, 1, 'P03', 'DangMo'),
    ('2025-11-26T14:30:00', 5, 1, 'P03', 'DangMo'),
    ('2025-11-26T19:00:00', 5, 1, 'P03', 'DangMo'),
    
    -- ===== RẠP 2 (Giga Mall) - P01 (2D) =====
    ('2025-11-26T10:00:00', 2, 2, 'P01', 'DangMo'),
    ('2025-11-26T15:00:00', 2, 2, 'P01', 'DangMo'),
    ('2025-11-26T20:00:00', 2, 2, 'P01', 'DangMo'),
    
    -- ===== RẠP 2 (Giga Mall) - P02 (4DX) =====
    ('2025-11-26T10:00:00', 4, 2, 'P02', 'DangMo'),
    ('2025-11-26T15:00:00', 4, 2, 'P02', 'DangMo'),
    ('2025-11-26T20:00:00', 4, 2, 'P02', 'DangMo'),
    
    -- ===== RẠP 3 (Hùng Vương) - P01 (2D) =====
    ('2025-11-26T10:00:00', 1, 3, 'P01', 'DangMo'),
    ('2025-11-26T14:30:00', 6, 3, 'P01', 'DangMo'),
    ('2025-11-26T18:00:00', 1, 3, 'P01', 'DangMo'),
    
    -- ===== RẠP 3 (Hùng Vương) - P02 (3D) =====
    ('2025-11-26T10:00:00', 3, 3, 'P02', 'DangMo'),
    ('2025-11-26T14:00:00', 3, 3, 'P02', 'DangMo'),
    ('2025-11-26T17:00:00', 3, 3, 'P02', 'DangMo'),
    
    -- ===== RẠP 4 (Vincom Royal City) - P01 (IMAX) =====
    ('2025-11-26T10:00:00', 5, 4, 'P01', 'DangMo'),
    ('2025-11-26T14:30:00', 5, 4, 'P01', 'DangMo'),
    ('2025-11-26T19:00:00', 5, 4, 'P01', 'DangMo'),
    
    -- ===== RẠP 6 (Landmark 81) - P01 (4DX) =====
    ('2025-11-26T10:00:00', 4, 6, 'P01', 'DangMo'),
    ('2025-11-26T15:00:00', 4, 6, 'P01', 'DangMo'),
    ('2025-11-26T20:00:00', 4, 6, 'P01', 'DangMo'),
    
    -- ===== NGÀY 27/11 - RẠP 7 =====
    ('2025-11-27T10:00:00', 1, 7, 'P01', 'DangMo'),
    ('2025-11-27T14:30:00', 2, 7, 'P01', 'DangMo'),
    ('2025-11-27T19:00:00', 1, 7, 'P01', 'DangMo'),
    
    ('2025-11-27T10:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-27T14:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-27T17:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-27T20:00:00', 6, 7, 'P02', 'DangMo'),
    
    ('2025-11-27T10:00:00', 5, 7, 'P03', 'DangMo'),
    ('2025-11-27T14:30:00', 5, 7, 'P03', 'DangMo'),
    ('2025-11-27T19:00:00', 4, 7, 'P03', 'DangMo'),
    
    -- ===== NGÀY 28-30/11 =====
    ('2025-11-28T10:00:00', 1, 7, 'P01', 'DangMo'),
    ('2025-11-28T14:30:00', 2, 7, 'P01', 'DangMo'),
    ('2025-11-28T19:00:00', 1, 7, 'P01', 'DangMo'),
    
    ('2025-11-29T10:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-29T14:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-11-29T17:00:00', 6, 7, 'P02', 'DangMo'),
    
    ('2025-11-30T10:00:00', 5, 7, 'P03', 'DangMo'),
    ('2025-11-30T14:30:00', 4, 7, 'P03', 'DangMo'),
    ('2025-11-30T19:00:00', 5, 7, 'P03', 'DangMo'),
    
    -- ===== NGÀY 01-02/12 =====
    ('2025-12-01T10:00:00', 1, 7, 'P01', 'DangMo'),
    ('2025-12-01T14:30:00', 2, 7, 'P01', 'DangMo'),
    ('2025-12-01T19:00:00', 1, 7, 'P01', 'DangMo'),
    
    ('2025-12-02T10:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-12-02T14:00:00', 3, 7, 'P02', 'DangMo'),
    ('2025-12-02T17:00:00', 6, 7, 'P02', 'DangMo');
GO

PRINT 'Dang chen: HoaDon_SanPham';
INSERT INTO HoaDon_SanPham (HoaDon_ID, SanPham_ID, SoLuong, DonGiaLucBan)
VALUES
    (1, 21, 1, 110000), (2, 2, 1, 79000), (2, 11, 2, 45000),
    (4, 22, 1, 150000), (6, 1, 1, 79000), (7, 3, 1, 55000),
    (8, 23, 1, 85000), (8, 4, 1, 45000), (10, 12, 1, 45000), (10, 1, 1, 79000);
GO

PRINT 'Hoan tat chen du lieu day du!';
PRINT 'Co the test booking flow voi:';
PRINT '- 6 phim DangChieu (ID 1-6)';
PRINT '- Suat chieu tu hom nay (2025-11-26) den 2025-12-02';
PRINT '- Moi phong co 50 ghe (5 hang x 10 ghe)';
PRINT '- Tat ca suat chieu KHONG TRUNG LAP thoi gian trong cung phong';
GO