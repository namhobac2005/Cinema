/*
===============================================================
    SCRIPT XÓA TOÀN BỘ DỮ LIỆU (GIỮ CẤU TRÚC BẢNG)
    Chạy script này trước khi chạy insert_Cinema.sql
===============================================================
*/

USE Cinema;
GO

PRINT 'Bat dau xoa du lieu...';

-- Tắt ràng buộc khóa ngoại tạm thời
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

-- Xóa dữ liệu theo thứ tự từ bảng con đến bảng cha
PRINT 'Xoa: Ve';
DELETE FROM Ve;
DBCC CHECKIDENT ('Ve', RESEED, 0);

PRINT 'Xoa: HoaDon_SanPham';
DELETE FROM HoaDon_SanPham;

PRINT 'Xoa: SuatChieu';
DELETE FROM SuatChieu;
DBCC CHECKIDENT ('SuatChieu', RESEED, 0);

PRINT 'Xoa: Ghe';
DELETE FROM Ghe;

PRINT 'Xoa: PhongChieu';
DELETE FROM PhongChieu;

PRINT 'Xoa: HoaDon';
DELETE FROM HoaDon;
DBCC CHECKIDENT ('HoaDon', RESEED, 0);

PRINT 'Xoa: Combo_SanPham';
DELETE FROM Combo_SanPham;

PRINT 'Xoa: LoaiPhim';
DELETE FROM LoaiPhim;

PRINT 'Xoa: DaoDien';
DELETE FROM DaoDien;

PRINT 'Xoa: DienVien';
DELETE FROM DienVien;

PRINT 'Xoa: Combo';
DELETE FROM Combo;

PRINT 'Xoa: NuocUong';
DELETE FROM NuocUong;

PRINT 'Xoa: ThucAn';
DELETE FROM ThucAn;

PRINT 'Xoa: NhanVien';
DELETE FROM NhanVien;

PRINT 'Xoa: KhachHang';
DELETE FROM KhachHang;

PRINT 'Xoa: Voucher';
DELETE FROM Voucher;
DBCC CHECKIDENT ('Voucher', RESEED, 0);

PRINT 'Xoa: GiaVe';
DELETE FROM GiaVe;
DBCC CHECKIDENT ('GiaVe', RESEED, 0);

PRINT 'Xoa: Rap';
DELETE FROM Rap;
DBCC CHECKIDENT ('Rap', RESEED, 0);

PRINT 'Xoa: Phim';
DELETE FROM Phim;
DBCC CHECKIDENT ('Phim', RESEED, 0);

PRINT 'Xoa: SanPham';
DELETE FROM SanPham;
DBCC CHECKIDENT ('SanPham', RESEED, 0);

PRINT 'Xoa: NguoiDung';
DELETE FROM NguoiDung;
DBCC CHECKIDENT ('NguoiDung', RESEED, 0);

-- Bật lại ràng buộc khóa ngoại
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO

PRINT 'Da xoa toan bo du lieu thanh cong!';
PRINT 'Ban co the chay insert_Cinema.sql de chen du lieu moi.';
GO