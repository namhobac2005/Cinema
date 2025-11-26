/*
USE master;
GO

ALTER DATABASE Cinema SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE Cinema;
GO
*/


CREATE DATABASE Cinema;
GO
/* Chạy bằng quyền admin (sa) */
USE master;
GO

/* 1. Tạo một LOGIN ở cấp Server */
CREATE LOGIN sManager WITH PASSWORD = 'pass123';
GO

/* 2. Chuyển sang database Cinema */
USE Cinema;
GO

/* 3. Tạo một USER cho database này, liên kết với LOGIN vừa tạo */
CREATE USER sManager FOR LOGIN sManager;
GO

/* 4. Gán "all access rights" cho user này (quyền db_owner là cao nhất) */
ALTER ROLE db_owner ADD MEMBER sManager;
GO

PRINT 'Da tao user sManager voi full quyen tren CSDL Cinema.';

USE Cinema;
GO

------- CREATE TABLE -------
CREATE TABLE NguoiDung (
    ID              INT IDENTITY(1,1) NOT NULL,
    HovaTendem      NVARCHAR(100)      NOT NULL,
    Ten             NVARCHAR(100)      NOT NULL,
    NgaySinh        DATE,
    VaiTro          VARCHAR(20)       NOT NULL,   
    SoDienThoai     VARCHAR(15)       NULL,
    Email           VARCHAR(100)      NULL,
    MatKhau         VARCHAR(255)      NULL,

    CONSTRAINT PK_NguoiDung PRIMARY KEY (ID),
    CONSTRAINT CK_NguoiDung_VaiTro
        CHECK (VaiTro IN ('KhachHang','NhanVien','QuanLy')),

    CONSTRAINT CK_NguoiDung_Email_Format
        CHECK (Email IS NULL OR Email LIKE '%_@_%._%'),
        
    CONSTRAINT CK_NguoiDung_SoDienThoai
        CHECK (
           SoDienThoai IS NULL
           OR (LEN(SoDienThoai) = 10 AND SoDienThoai LIKE '0[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
        )
);
GO
/* Tạo chỉ mục UNIQUE có điều kiện:
Chỉ bắt lỗi trùng lặp khi giá trị KHÔNG PHẢI LÀ NULL.
Cho phép chèn nhiều giá trị NULL.
*/
CREATE UNIQUE INDEX UQ_NguoiDung_Email_NotNull
ON NguoiDung(Email)
WHERE Email IS NOT NULL;
GO

CREATE UNIQUE INDEX UQ_NguoiDung_SoDienThoai_NotNull
ON NguoiDung(SoDienThoai)
WHERE SoDienThoai IS NOT NULL;
GO

-- 2) KhachHang

CREATE TABLE KhachHang (
    NguoiDung_ID    INT             NOT NULL,
    HangThanhVien   VARCHAR(50)     NULL,
    DiemTichLuy     INT             NOT NULL CONSTRAINT DF_KhachHang_Diem DEFAULT(0),
    CONSTRAINT PK_KhachHang PRIMARY KEY (NguoiDung_ID),
    CONSTRAINT FK_KhachHang_NguoiDung
        FOREIGN KEY (NguoiDung_ID) REFERENCES NguoiDung(ID) ON DELETE CASCADE,
    CONSTRAINT CK_KhachHang_DiemTichLuy CHECK (DiemTichLuy >= 0)
);
GO

-- 3) NhanVien 

CREATE TABLE NhanVien (
    NguoiDung_ID    INT              NOT NULL,
    NgayVaoLam      DATE             NOT NULL,
    LuongCoBan      DECIMAL(10,2)    NOT NULL,
    CONSTRAINT PK_NhanVien PRIMARY KEY (NguoiDung_ID),
    CONSTRAINT FK_NhanVien_NguoiDung
        FOREIGN KEY (NguoiDung_ID) REFERENCES NguoiDung(ID) ON DELETE CASCADE,
    CONSTRAINT CK_NhanVien_LuongCoBan CHECK (LuongCoBan >= 0)
);
GO


-- 4) SanPham 

CREATE TABLE SanPham (
    ID              INT IDENTITY(1,1) NOT NULL,
    TenSP           NVARCHAR(255)      NOT NULL,
    DonGia          DECIMAL(10,2)     NOT NULL,
    TonKho          INT               NOT NULL CONSTRAINT DF_SanPham_TonKho DEFAULT(0),
    PhanLoai        VARCHAR(20)       NOT NULL,  
    NhaPhanPhoi     NVARCHAR(255)      NOT NULL,

    CONSTRAINT PK_SanPham PRIMARY KEY (ID),
    CONSTRAINT CK_SanPham_DonGia CHECK (DonGia > 0),
    CONSTRAINT CK_SanPham_TonKho CHECK (TonKho >= 0),
    CONSTRAINT CK_SanPham_PhanLoai CHECK (PhanLoai IN ('ThucAn','NuocUong','Combo'))
);
GO


-- 5) ThucAn 

CREATE TABLE ThucAn (
    SanPham_ID  INT          NOT NULL,
    TrongLuong  NVARCHAR(100)  NULL,
    Vi          NVARCHAR(100) NULL,

    CONSTRAINT PK_ThucAn PRIMARY KEY (SanPham_ID),
    CONSTRAINT FK_ThucAn_SanPham
        FOREIGN KEY (SanPham_ID) REFERENCES SanPham(ID) ON DELETE CASCADE
);
GO


-- 6) NuocUong 

CREATE TABLE NuocUong (
    SanPham_ID  INT          NOT NULL,
    TheTich     NVARCHAR(100)  NULL,
    CoGas       BIT          NOT NULL CONSTRAINT DF_NuocUong_CoGas DEFAULT(0),

    CONSTRAINT PK_NuocUong PRIMARY KEY (SanPham_ID),
    CONSTRAINT FK_NuocUong_SanPham
        FOREIGN KEY (SanPham_ID) REFERENCES SanPham(ID) ON DELETE CASCADE
);
GO


-- 7) Combo 

CREATE TABLE Combo (
    SanPham_ID  INT         NOT NULL,
    MoTa        NVARCHAR(MAX) NULL,

    CONSTRAINT PK_Combo PRIMARY KEY (SanPham_ID),
    CONSTRAINT FK_Combo_SanPham
        FOREIGN KEY (SanPham_ID) REFERENCES SanPham(ID) ON DELETE CASCADE
);
GO


-- 8) Combo_SanPham (M:N combo <-> sản phẩm)
CREATE TABLE Combo_SanPham (
    Combo_ID        INT NOT NULL,   
    SanPhamCon_ID   INT NOT NULL,   
    SoLuong         INT NOT NULL,

    CONSTRAINT PK_Combo_SanPham PRIMARY KEY (Combo_ID, SanPhamCon_ID),
    CONSTRAINT FK_ComboSP_Combo
        FOREIGN KEY (Combo_ID) REFERENCES SanPham(ID) ON DELETE CASCADE,
    CONSTRAINT FK_ComboSP_SanPhamCon
        FOREIGN KEY (SanPhamCon_ID) REFERENCES SanPham(ID),
    CONSTRAINT CK_ComboSP_SoLuong CHECK (SoLuong > 0)
);
GO


-- 9) Phim

CREATE TABLE Phim (
    ID              INT IDENTITY(1,1) NOT NULL,
    TenPhim         NVARCHAR(255)      NOT NULL,
    MoTa            NVARCHAR(MAX)      NULL,
    ThoiLuong       INT               NULL,
    XuatXu          NVARCHAR(100)      NULL,
    DangPhim        VARCHAR(10)       NOT NULL,  
    NgayPhatHanh    DATE              NULL,
    PhuDe           NVARCHAR(25),
    LongTieng       NVARCHAR(25),
    TrangThaiPhim   VARCHAR(20)       NOT NULL,  
    TrailerURL      VARCHAR(255)      NULL,
    PosterURL       VARCHAR(255)      NULL,
    GioiHanTuoi     INT               NOT NULL CONSTRAINT DF_Phim_GioiHan DEFAULT(0),

    CONSTRAINT PK_Phim PRIMARY KEY (ID),
    CONSTRAINT CK_Phim_ThoiLuong CHECK (ThoiLuong IS NULL OR ThoiLuong > 0),
    CONSTRAINT CK_Phim_Dang CHECK (DangPhim IN ('2D','3D','IMAX','4DX')),
    CONSTRAINT CK_Phim_TrangThai CHECK (TrangThaiPhim IN ('SapChieu','DangChieu','NgungChieu')),
    CONSTRAINT CK_Phim_GioiHan CHECK (GioiHanTuoi IN (0, 13, 16, 18))
);
GO


-- 10) DienVien 

CREATE TABLE DienVien (
    Phim_ID       INT           NOT NULL,
    TenDienVien   NVARCHAR(255)  NOT NULL,

    CONSTRAINT PK_DienVien PRIMARY KEY (Phim_ID, TenDienVien),
    CONSTRAINT FK_DienVien_Phim
        FOREIGN KEY (Phim_ID) REFERENCES Phim(ID) ON DELETE CASCADE
);
GO


-- 11) DaoDien 

CREATE TABLE DaoDien (
    Phim_ID       INT           NOT NULL,
    TenDaoDien    NVARCHAR(255)  NOT NULL,

    CONSTRAINT PK_DaoDien PRIMARY KEY (Phim_ID, TenDaoDien),
    CONSTRAINT FK_DaoDien_Phim
        FOREIGN KEY (Phim_ID) REFERENCES Phim(ID) ON DELETE CASCADE
);
GO


-- 12) LoaiPhim 

CREATE TABLE LoaiPhim (
    Phim_ID        INT           NOT NULL,
    TenLoaiPhim    NVARCHAR(255)  NOT NULL,
    CONSTRAINT PK_LoaiPhim PRIMARY KEY (Phim_ID, TenLoaiPhim),
    CONSTRAINT FK_LoaiPhim_Phim
        FOREIGN KEY (Phim_ID) REFERENCES Phim(ID) ON DELETE CASCADE
);
GO


-- 13) Rap 

CREATE TABLE Rap (
    ID          INT IDENTITY(1,1) NOT NULL,
    TenRap      NVARCHAR(100)      NOT NULL,
    DiaChi      NVARCHAR(255)      NOT NULL,
    Hotline     VARCHAR(15)       NULL UNIQUE,
    TrangThai   VARCHAR(20)       NOT NULL,  

    CONSTRAINT PK_Rap PRIMARY KEY (ID),
    CONSTRAINT CK_Rap_TrangThai CHECK (TrangThai IN ('HoatDong','BaoTri','TamDong')),
    CONSTRAINT CK_Rap_Hotline CHECK (
       Hotline IS NULL OR
       Hotline LIKE '1900____' OR Hotline LIKE '1900______' OR
       Hotline LIKE '1800____' OR Hotline LIKE '1800______'
    )
);
GO


-- 14) PhongChieu 

CREATE TABLE PhongChieu (
    Rap_ID      INT          NOT NULL,
    SoPhong     VARCHAR(10)  NOT NULL,
    SucChua     INT          NOT NULL,
    LoaiPhong   VARCHAR(10)  NOT NULL,     
    TrangThai   VARCHAR(20)  NOT NULL,     

    CONSTRAINT PK_PhongChieu PRIMARY KEY (Rap_ID, SoPhong),
    CONSTRAINT FK_PhongChieu_Rap
        FOREIGN KEY (Rap_ID) REFERENCES Rap(ID) ON DELETE CASCADE,

    CONSTRAINT CK_PhongChieu_SucChua CHECK (SucChua > 0),
    CONSTRAINT CK_PhongChieu_Loai CHECK (LoaiPhong IN ('2D','3D','IMAX','4DX')),
    CONSTRAINT CK_PhongChieu_TrangThai CHECK (TrangThai IN ('HoatDong','BaoTri'))
);
GO


-- 15) Ghe 

CREATE TABLE Ghe (
    Rap_ID      INT         NOT NULL,
    SoPhong     VARCHAR(10) NOT NULL,
    HangGhe     VARCHAR(5)  NOT NULL,
    SoGhe       VARCHAR(5)  NOT NULL,
    LoaiGhe     VARCHAR(10) NOT NULL,  

    CONSTRAINT PK_Ghe PRIMARY KEY (Rap_ID, SoPhong, HangGhe, SoGhe),
    CONSTRAINT FK_Ghe_PhongChieu
        FOREIGN KEY (Rap_ID, SoPhong) REFERENCES PhongChieu (Rap_ID, SoPhong) ON DELETE CASCADE,

    CONSTRAINT CK_Ghe_Loai CHECK (LoaiGhe IN ('Thuong','VIP','Doi'))
);
GO


-- 16) SuatChieu

CREATE TABLE SuatChieu (
    ID               INT IDENTITY(1,1) NOT NULL,
    ThoiGianBatDau   DATETIME          NOT NULL,
    Phim_ID          INT               NOT NULL,
    Rap_ID           INT               NOT NULL,
    SoPhong          VARCHAR(10)       NOT NULL,
    TrangThai        VARCHAR(20)       NOT NULL,  

    CONSTRAINT PK_SuatChieu PRIMARY KEY (ID),
    CONSTRAINT FK_SuatChieu_Phim
        FOREIGN KEY (Phim_ID) REFERENCES Phim(ID) ON DELETE CASCADE,
    CONSTRAINT FK_SuatChieu_PhongChieu
        FOREIGN KEY (Rap_ID, SoPhong) REFERENCES PhongChieu (Rap_ID, SoPhong) ON DELETE CASCADE,

    CONSTRAINT CK_SuatChieu_TrangThai CHECK (TrangThai IN ('DangMo','DaDong','DaHuy'))
);
GO


-- 17) GiaVe

CREATE TABLE GiaVe (
    ID                 INT IDENTITY(1,1) NOT NULL,
    LoaiGhe            VARCHAR(10)       NOT NULL,    
    LoaiSuatChieu      VARCHAR(20)       NOT NULL,    
    DinhDangPhim       VARCHAR(10)       NOT NULL,    
    DonGia             DECIMAL(10,2)     NOT NULL,
    NgayBatDauApDung   DATE              NULL,
    NgayKetThucApDung  DATE              NULL,
    TrangThai          VARCHAR(20)       NOT NULL CONSTRAINT DF_GiaVe_TrangThai DEFAULT ('ConHieuLuc'),

    CONSTRAINT PK_GiaVe PRIMARY KEY (ID),
    CONSTRAINT CK_GiaVe_LoaiGhe CHECK (LoaiGhe IN ('Thuong','VIP','Doi')),
    CONSTRAINT CK_GiaVe_LoaiSC CHECK (LoaiSuatChieu IN ('NgayThuong','CuoiTuan','Le','GioVang')),
    CONSTRAINT CK_GiaVe_DinhDang CHECK (DinhDangPhim IN ('2D','3D','IMAX','4DX')),
    CONSTRAINT CK_GiaVe_DonGia CHECK (DonGia > 0),
    CONSTRAINT CK_GiaVe_DateRange CHECK (NgayKetThucApDung IS NULL OR NgayKetThucApDung >= NgayBatDauApDung),
    CONSTRAINT CK_GiaVe_TrangThai CHECK (TrangThai IN ('ConHieuLuc','HetHieuLuc'))
);
GO

-- 21) Voucher

CREATE TABLE Voucher (
    ID          INT IDENTITY(1,1) NOT NULL,
    MaGiam      VARCHAR(20)       NOT NULL,
    Loai        VARCHAR(20)       NOT NULL,    
    MucGiam     DECIMAL(10,2)     NOT NULL,
    SoLuong     INT               NOT NULL CONSTRAINT DF_Voucher_SoLuong DEFAULT(10),

    CONSTRAINT PK_Voucher PRIMARY KEY (ID),
    CONSTRAINT UQ_Voucher_MaGiam UNIQUE (MaGiam),

    CONSTRAINT CK_Voucher_Loai CHECK (Loai IN ('PhanTram','SoTien')),

    CONSTRAINT CK_Voucher_MucGiam_ByLoai CHECK (
        (Loai = 'PhanTram' AND MucGiam > 0 AND MucGiam <= 100)
        OR (Loai = 'SoTien'  AND MucGiam > 0)
    )
);
GO


-- 18) HoaDon 

CREATE TABLE HoaDon (
    ID                   INT IDENTITY(1,1) NOT NULL,
    ThoiGianTao          DATETIME          NOT NULL CONSTRAINT DF_HoaDon_ThoiGian DEFAULT (SYSDATETIME()),
    TrangThaiThanhToan   VARCHAR(20)       NOT NULL,      
    PhuongThucThanhToan  VARCHAR(50)       NULL,
    KhachHang_ID         INT               NULL,
    NhanVien_ID          INT               NULL,
    Voucher_ID           INT               NULL

    CONSTRAINT PK_HoaDon PRIMARY KEY (ID),

    CONSTRAINT FK_HoaDon_KhachHang
        FOREIGN KEY (KhachHang_ID) REFERENCES KhachHang(NguoiDung_ID),
    CONSTRAINT FK_HoaDon_NhanVien
        FOREIGN KEY (NhanVien_ID) REFERENCES NhanVien(NguoiDung_ID),
    CONSTRAINT FK_HoaDon_Voucher
        FOREIGN KEY (Voucher_ID) REFERENCES Voucher(ID),

    CONSTRAINT CK_HoaDon_TrangThaiTT CHECK (TrangThaiThanhToan IN ('ChuaThanhToan','DaThanhToan','DaHuy'))
);
GO


-- 19) Ve 

CREATE TABLE Ve (
    ID              INT IDENTITY(1,1) NOT NULL,
    ThoiGianDat     DATETIME          NOT NULL CONSTRAINT DF_Ve_ThoiGianDat DEFAULT (SYSDATETIME()),
    GiaVeBan        DECIMAL(10,2)     NOT NULL,
    SuatChieu_ID    INT               NOT NULL,
    Rap_ID          INT               NOT NULL,
    SoPhong         VARCHAR(10)       NOT NULL,
    HangGhe         VARCHAR(5)        NOT NULL,
    SoGhe           VARCHAR(5)        NOT NULL,
    HoaDon_ID       INT               NULL,
    TrangThai       VARCHAR(20)       NOT NULL,     
    GiaVe_ID        INT               NULL,


    CONSTRAINT PK_Ve PRIMARY KEY (ID),

    CONSTRAINT FK_Ve_SuatChieu
        FOREIGN KEY (SuatChieu_ID) REFERENCES SuatChieu(ID) ON DELETE CASCADE,

    CONSTRAINT FK_Ve_Ghe
        FOREIGN KEY (Rap_ID, SoPhong, HangGhe, SoGhe)
        REFERENCES Ghe (Rap_ID, SoPhong, HangGhe, SoGhe),

    CONSTRAINT FK_Ve_HoaDon
        FOREIGN KEY (HoaDon_ID) REFERENCES HoaDon(ID) ON DELETE CASCADE,

    CONSTRAINT FK_Ve_GiaVe
        FOREIGN KEY (GiaVe_ID) REFERENCES GiaVe(ID) ON DELETE SET NULL,

    CONSTRAINT CK_Ve_GiaVeBan CHECK (GiaVeBan > 0),
    CONSTRAINT CK_Ve_TrangThai CHECK (TrangThai IN ('DaThanhToan','GiuCho','DaHuy'))
);
GO
-- Đảm bảo (SuatChieu_ID, Rap_ID, SoPhong, HangGhe, SoGhe) là duy nhất
-- nhưng chỉ áp dụng cho các vé CHƯA BỊ HỦY.
CREATE UNIQUE INDEX UQ_Ve_MotGheMotSuat
ON Ve (SuatChieu_ID, Rap_ID, SoPhong, HangGhe, SoGhe)
WHERE TrangThai <> 'DaHuy';
GO

-- 20) HoaDon_SanPham 

CREATE TABLE HoaDon_SanPham (
    HoaDon_ID       INT           NOT NULL,
    SanPham_ID      INT           NOT NULL,
    SoLuong         INT           NOT NULL,
    DonGiaLucBan    DECIMAL(10,2) NOT NULL,

    CONSTRAINT PK_HoaDon_SanPham PRIMARY KEY (HoaDon_ID, SanPham_ID),
    CONSTRAINT FK_HDSP_HoaDon
        FOREIGN KEY (HoaDon_ID) REFERENCES HoaDon(ID) ON DELETE CASCADE,
    CONSTRAINT FK_HDSP_SanPham
        FOREIGN KEY (SanPham_ID) REFERENCES SanPham(ID) ON DELETE CASCADE,

    CONSTRAINT CK_HDSP_SoLuong CHECK (SoLuong > 0),
    CONSTRAINT CK_HDSP_DonGia CHECK (DonGiaLucBan > 0)
);
GO

------ KẾT THÚC TẠO TABLE ------

----- Trigger ------

-- TỐI ƯU HIỆU NĂNG TRUY VẤN SUẤT CHIẾU
CREATE INDEX IX_SuatChieu_RoomStart
ON SuatChieu (Rap_ID, SoPhong, ThoiGianBatDau);
GO

--trigger 
CREATE TRIGGER TRG_SuatChieu_NoOverlap
ON SuatChieu
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Phim  p ON p.ID = i.Phim_ID
        JOIN SuatChieu s
             ON s.Rap_ID = i.Rap_ID
            AND s.SoPhong = i.SoPhong
            AND s.ID <> i.ID
            AND s.TrangThai <> 'DaHuy'
        JOIN Phim  ps ON ps.ID = s.Phim_ID
        WHERE i.TrangThai <> 'DaHuy'
          AND i.ThoiGianBatDau < DATEADD(MINUTE, ps.ThoiLuong, s.ThoiGianBatDau)
          AND DATEADD(MINUTE, p.ThoiLuong, i.ThoiGianBatDau) > s.ThoiGianBatDau
    )
    BEGIN
        RAISERROR (N'Lỗi: Suất chiếu trùng lắp thời gian trong cùng phòng.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_SuatChieu_RoomStart'
      AND object_id = OBJECT_ID('dbo.SuatChieu')
)
BEGIN
    CREATE INDEX IX_SuatChieu_RoomStart
    ON SuatChieu (Rap_ID, SoPhong, ThoiGianBatDau);
END
GO

CREATE TRIGGER TRG_HoaDon_CongDiem
ON HoaDon
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    -- Bảng tạm chứa các hóa đơn vừa được thanh toán
    -- (Để xử lý trường hợp UPDATE nhiều dòng cùng lúc)
    DECLARE @HoaDonThanhToan TABLE (
        HoaDon_ID INT,
        KhachHang_ID INT
    );

    -- Lấy các hóa đơn VỪA CHUYỂN SANG 'DaThanhToan'
    INSERT INTO @HoaDonThanhToan (HoaDon_ID, KhachHang_ID)
    SELECT
        i.ID,
        i.KhachHang_ID
    FROM
        inserted i
    LEFT JOIN
        deleted d ON i.ID = d.ID
    WHERE
        i.KhachHang_ID IS NOT NULL            -- Phải là của khách hàng
        AND i.TrangThaiThanhToan = 'DaThanhToan' -- Trạng thái mới là 'DaThanhToan'
        AND (d.TrangThaiThanhToan IS NULL OR d.TrangThaiThanhToan <> 'DaThanhToan'); -- Trạng thái cũ KHÔNG PHẢI 'DaThanhToan'

    -- Nếu không có hóa đơn nào thỏa mãn thì thoát
    IF NOT EXISTS (SELECT 1 FROM @HoaDonThanhToan)
        RETURN;

    -- Bảng tạm chứa tổng tiền (để tính điểm)
    DECLARE @TongTien TABLE (
        KhachHang_ID INT,
        TongTienHoaDon DECIMAL(10, 2)
    );

    -- 1. Tính tổng tiền vé
    INSERT INTO @TongTien (KhachHang_ID, TongTienHoaDon)
    SELECT
        hdt.KhachHang_ID,
        ISNULL(SUM(v.GiaVeBan), 0)
    FROM
        @HoaDonThanhToan hdt
    JOIN
        Ve v ON v.HoaDon_ID = hdt.HoaDon_ID
    WHERE
        v.TrangThai = 'DaThanhToan' -- Chỉ tính vé đã thanh toán
    GROUP BY
        hdt.KhachHang_ID;

    -- 2. Tính tổng tiền sản phẩm (bắp nước)
    INSERT INTO @TongTien (KhachHang_ID, TongTienHoaDon)
    SELECT
        hdt.KhachHang_ID,
        ISNULL(SUM(hds.SoLuong * hds.DonGiaLucBan), 0)
    FROM
        @HoaDonThanhToan hdt
    JOIN
        HoaDon_SanPham hds ON hds.HoaDon_ID = hdt.HoaDon_ID
    GROUP BY
        hdt.KhachHang_ID;

    -- 3. Cập nhật điểm cho KhachHang
    -- Giả sử tỉ lệ là 100.000 VNĐ = 100 điểm (tức 0.001)
    UPDATE KhachHang
    SET
        -- Cộng dồn điểm
        DiemTichLuy = kh.DiemTichLuy + td.DiemCong
    FROM
        KhachHang kh
    JOIN (
        -- Tính tổng điểm từ vé và sản phẩm
        SELECT
            KhachHang_ID,
            -- ÁP DỤNG TỈ LỆ ĐIỂM Ở ĐÂY (VÍ DỤ: 0.001)
            CAST(SUM(TongTienHoaDon) * 0.001 AS INT) AS DiemCong
        FROM
            @TongTien
        GROUP BY
            KhachHang_ID
    ) AS td ON kh.NguoiDung_ID = td.KhachHang_ID
    WHERE
        td.DiemCong > 0; -- Chỉ update nếu có cộng điểm
END;
GO

--Trigger--
CREATE OR ALTER TRIGGER trg_Update_HangThanhVien
ON KhachHang
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra:
    -- 1. Phải là INSERT (không có trong deleted) HOẶC
    -- 2. Là UPDATE nhưng giá trị DiemTichLuy đã thay đổi
    --    (hoặc giá trị DiemTichLuy có thay đổi đủ để thay đổi cấp bậc)
    
    -- Tối ưu hóa: Chỉ chạy UPDATE trên các hàng có sự thay đổi về DiemTichLuy
    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN deleted d 
            ON i.NguoiDung_ID = d.NguoiDung_ID
        -- Trường hợp INSERT: d.NguoiDung_ID IS NULL
        -- Trường hợp UPDATE: i.DiemTichLuy <> d.DiemTichLuy
        WHERE d.NguoiDung_ID IS NULL OR i.DiemTichLuy <> d.DiemTichLuy
    )
    BEGIN
        UPDATE KH
        SET KH.HangThanhVien =
            CASE 
                WHEN i.DiemTichLuy >= 5000 THEN 'KimCuong'
                WHEN i.DiemTichLuy >= 1000 THEN 'Vang'
                WHEN i.DiemTichLuy >= 100 THEN 'Bac'
                ELSE 'Thuong'
            END
        FROM KhachHang KH
        INNER JOIN inserted i    
            ON KH.NguoiDung_ID = i.NguoiDung_ID;
    END
END;
GO

USE Cinema;
GO

CREATE OR ALTER PROCEDURE sp_DangNhap
    @TenDangNhap VARCHAR(100), -- Đây có thể là Email hoặc SĐT
    @MatKhau VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID AS NguoiDung_ID,
        HovaTendem,
        Ten,
        Email,
        SoDienThoai,
        VaiTro
    FROM
        NguoiDung
    WHERE
        -- Kiểm tra xem TenDangNhap khớp với Email HOẶC SoDienThoai
        (Email = @TenDangNhap OR SoDienThoai = @TenDangNhap)
        AND MatKhau = @MatKhau;
        -- Chỉ những tài khoản có mật khẩu mới đăng nhập được
END;
GO

---FUNCTION---
USE Cinema
GO

CREATE FUNCTION fn_TinhTongDoanhThuPhim (@MaPhim INT)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @TongDoanhThu DECIMAL(18, 2);

    -- 1. Validation: Kiểm tra xem MaPhim có tồn tại không 
    IF NOT EXISTS (SELECT 1 FROM Phim WHERE ID = @MaPhim)
    BEGIN
        -- Trả về 0 nếu phim không tồn tại
        RETURN 0.00; 
    END

    -- 2. Tính tổng doanh thu (dùng Aggregate Function, Join 2 bảng) 
    SELECT @TongDoanhThu = SUM(v.GiaVeBan)
    FROM Ve v
    JOIN SuatChieu sc ON v.SuatChieu_ID = sc.ID
    WHERE 
        sc.Phim_ID = @MaPhim
        -- Chỉ tính các vé đã thanh toán (tránh vé Hủy, vé Giữ chỗ)
        AND v.TrangThai = 'DaThanhToan'; 

    -- 3. Sử dụng IF để xử lý trường hợp phim chưa có doanh thu 
    IF @TongDoanhThu IS NULL
    BEGIN
        SET @TongDoanhThu = 0.00;
    END

    RETURN @TongDoanhThu;
END;
GO

CREATE FUNCTION fn_TinhTongTienSanPham (@MaHoaDon INT)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @TongTienSP DECIMAL(18, 2);

    -- 1. Validation: Kiểm tra xem MaHoaDon có tồn tại không 
    IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE ID = @MaHoaDon)
    BEGIN
        -- Trả về 0 nếu hóa đơn không tồn tại
        RETURN 0.00;
    END

    -- 2. Tính tổng tiền sản phẩm (Aggregate, Group By) 
    SELECT @TongTienSP = SUM(SoLuong * DonGiaLucBan)
    FROM HoaDon_SanPham
    WHERE HoaDon_ID = @MaHoaDon
    GROUP BY HoaDon_ID;

    RETURN ISNULL(@TongTienSP,0.00);
END;
GO

CREATE FUNCTION fn_TinhDoanhThuHomNay ()
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @DoanhThu DECIMAL(18, 2);

    SELECT @DoanhThu = SUM(v.GiaVeBan)
    FROM Ve v
    JOIN HoaDon h ON v.HoaDon_ID = h.ID
    WHERE 
        h.TrangThaiThanhToan = 'DaThanhToan'
        -- Chỉ lấy các hóa đơn được tạo HÔM NAY
        AND CONVERT(date, h.ThoiGianTao) = CONVERT(date, GETDATE());
    
    -- Nếu không có doanh thu, trả về 0
    RETURN ISNULL(@DoanhThu, 0);
END;
GO

---PROCEDURE---

USE Cinema;
GO

CREATE OR ALTER PROCEDURE sp_LayTrangThaiGhe
    @SuatChieu_ID INT
AS
BEGIN
    -- Xác định Rạp và Phòng
    DECLARE @Rap_ID INT, @SoPhong VARCHAR(10);
    SELECT @Rap_ID = Rap_ID, @SoPhong = SoPhong
    FROM SuatChieu
    WHERE ID = @SuatChieu_ID;

    -- Không tìm thấy phòng có suất chiếu này
    IF @Rap_ID IS NULL
    BEGIN
        RAISERROR(N'Suất chiếu không tồn tại.', 16, 1);
        RETURN;
    END

    SELECT
        g.HangGhe,
        g.SoGhe,
        g.LoaiGhe,
        CASE
            WHEN v.TrangThai = 'DaThanhToan' THEN N'DaBan'
            WHEN v.TrangThai = 'GiuCho' THEN N'DangGiu'
            ELSE N'ConTrong'
        END AS TrangThai
    FROM Ghe g
    LEFT JOIN Ve v ON g.Rap_ID = v.Rap_ID
             AND g.SoPhong = v.SoPhong
             AND g.HangGhe = v.HangGhe
             AND g.SoGhe = v.SoGhe
             AND v.SuatChieu_ID = @SuatChieu_ID
    WHERE
        g.Rap_ID = @Rap_ID
        AND g.SoPhong = @SoPhong
    ORDER BY
        g.HangGhe, TRY_CAST(g.SoGhe AS INT);
END;
GO


CREATE TYPE GheDatType AS TABLE (
    HangGhe VARCHAR(5) NOT NULL,
    SoGhe   VARCHAR(5) NOT NULL,
    PRIMARY KEY (HangGhe, SoGhe)
);
GO

CREATE OR ALTER PROCEDURE sp_DatVe_TaoHoaDon
    @KhachHang_ID INT,
    @SuatChieu_ID INT,
    @DanhSachGhe GheDatType READONLY
AS
BEGIN
    DECLARE @NewHoaDonID INT;
    DECLARE @Rap_ID INT, @SoPhong VARCHAR(10), @Phim_ID INT, @DinhDangPhim VARCHAR(10), @ThoiGianBatDau DATETIME;
    DECLARE @LoaiSuatChieu VARCHAR(20);

    -- Lấy thông tin suất chiếu
    SELECT
        @Rap_ID = sc.Rap_ID,
        @SoPhong = sc.SoPhong,
        @ThoiGianBatDau = sc.ThoiGianBatDau,
        @DinhDangPhim = p.DangPhim
    FROM SuatChieu sc JOIN Phim p ON sc.Phim_ID = p.ID WHERE sc.ID = @SuatChieu_ID;

    IF @Rap_ID IS NULL
    BEGIN
        RAISERROR(N'Suất chiếu không tồn tại.', 16, 1);
        RETURN;
    END

    -- Xác định loại suất chiếu
    SET @LoaiSuatChieu = CASE
                            WHEN DATEPART(weekday, @ThoiGianBatDau) IN (7, 1) THEN 'CuoiTuan'
                            ELSE 'NgayThuong'
                        END;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Kiểm tra có ghế nào đã bị đặt không
        IF EXISTS (
            SELECT 1
            FROM @DanhSachGhe ds
            JOIN Ve v
                ON v.SuatChieu_ID = @SuatChieu_ID
                AND v.HangGhe = ds.HangGhe
                AND v.SoGhe = ds.SoGhe
                AND v.TrangThai <> 'DaHuy'
        )
        BEGIN
            RAISERROR(N'Lỗi: Một hoặc nhiều ghế bạn chọn đã có người đặt.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Tạo hóa đơn mới ở trạng thái "ChuaThanhToan"
        INSERT INTO HoaDon (ThoiGianTao, TrangThaiThanhToan, KhachHang_ID)
        VALUES (SYSDATETIME(), 'ChuaThanhToan', @KhachHang_ID);
        SET @NewHoaDonID = SCOPE_IDENTITY();

        -- Thêm các vé vào hóa đơn trạng thái "GiuCho"
        -- tra cứu giá vé dựa trên thông tin suất chiếu và loại ghế
        INSERT INTO Ve (ThoiGianDat, GiaVeBan, SuatChieu_ID, Rap_ID, SoPhong, HangGhe, SoGhe, HoaDon_ID, TrangThai, GiaVe_ID)
        SELECT
            SYSDATETIME(),
            gv.DonGia,      
            @SuatChieu_ID,
            @Rap_ID,
            @SoPhong,
            ds.HangGhe,
            ds.SoGhe,
            @NewHoaDonID,
            'GiuCho',       
            gv.ID           
        FROM @DanhSachGhe ds JOIN Ghe g ON g.Rap_ID = @Rap_ID -- Lấy thông tin ghế từ danh sách ghế
                   AND g.SoPhong = @SoPhong
                   AND g.HangGhe = ds.HangGhe
                   AND g.SoGhe = ds.SoGhe
        LEFT JOIN GiaVe gv ON gv.LoaiGhe = g.LoaiGhe -- Lấy giá vé từ thông tin ghế và vé
                      AND gv.LoaiSuatChieu = @LoaiSuatChieu
                      AND gv.DinhDangPhim = @DinhDangPhim
                      AND gv.TrangThai = 'ConHieuLuc';

        -- Kiểm tra có ghế nào không tìm thấy giá không
        IF EXISTS (
            SELECT 1
            FROM Ve v
            WHERE v.HoaDon_ID = @NewHoaDonID AND v.GiaVe_ID IS NULL
        )
        BEGIN
            RAISERROR(N'Lỗi: Không tìm thấy bảng giá phù hợp cho một trong các loại ghế đã chọn.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        COMMIT TRANSACTION;

        -- Trả về ID hóa đơn vừa tạo
        SELECT @NewHoaDonID AS HoaDonID;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE sp_XacNhanThanhToan
    @HoaDon_ID INT,
    @PhuongThucThanhToan VARCHAR(50),
    @MaVoucher VARCHAR(20) = NULL
AS
BEGIN 
    DECLARE @KhachHang_ID INT, @TrangThaiHD VARCHAR(20);
    DECLARE @TongTienVe DECIMAL(10,2), @TongTienSP DECIMAL(10,2), @TongCong DECIMAL(10,2);
    DECLARE @Voucher_ID INT, @LoaiGiam VARCHAR(20), @MucGiam DECIMAL(10,2), @TienGiam DECIMAL(10,2);
    DECLARE @TongThanhToan DECIMAL(10,2);

    -- Kiểm tra Hóa đơn
    SELECT @TrangThaiHD = TrangThaiThanhToan, @KhachHang_ID = KhachHang_ID
    FROM HoaDon
    WHERE ID = @HoaDon_ID;

    IF @TrangThaiHD IS NULL
    BEGIN
        RAISERROR(N'Hóa đơn không tồn tại.', 16, 1);
        RETURN;
    END
    IF @TrangThaiHD <> 'ChuaThanhToan'
    BEGIN
        RAISERROR(N'Hóa đơn này đã được xử lý hoặc đã bị hủy.', 16, 1);
        RETURN;
    END

    -- Tính tổng tiền vé và sản phẩm
    SELECT @TongTienVe = ISNULL(SUM(GiaVeBan), 0) FROM Ve WHERE HoaDon_ID = @HoaDon_ID AND TrangThai = 'GiuCho';
    SELECT @TongTienSP = ISNULL(SUM(DonGiaLucBan * SoLuong), 0) FROM HoaDon_SanPham WHERE HoaDon_ID = @HoaDon_ID;
    SET @TongCong = @TongTienVe + @TongTienSP;
    SET @TienGiam = 0;

    IF @MaVoucher IS NOT NULL
    BEGIN
        SELECT @Voucher_ID = ID, @LoaiGiam = Loai, @MucGiam = MucGiam
        FROM Voucher
        WHERE MaGiam = @MaVoucher AND SoLuong > 0;

        IF @Voucher_ID IS NULL
        BEGIN
            RAISERROR(N'Mã voucher không hợp lệ hoặc đã hết lượt sử dụng.', 16, 1);
            RETURN;
        END

        IF @LoaiGiam = 'SoTien'
            SET @TienGiam = @MucGiam;
        ELSE IF @LoaiGiam = 'PhanTram'
            SET @TienGiam = @TongCong * (@MucGiam / 100.0);
        
        IF @TienGiam > @TongCong
            SET @TienGiam = @TongCong;
    END

    SET @TongThanhToan = @TongCong - @TienGiam;

    BEGIN TRY
        BEGIN TRANSACTION;

        --Cập nhật Voucher
        IF @Voucher_ID IS NOT NULL
        BEGIN
            UPDATE Voucher
            SET SoLuong = SoLuong - 1
            WHERE ID = @Voucher_ID;
        END

        -- Cập nhật Hóa Đơn
        UPDATE HoaDon
        SET
            TrangThaiThanhToan = 'DaThanhToan',
            PhuongThucThanhToan = @PhuongThucThanhToan,
            Voucher_ID = @Voucher_ID
        WHERE ID = @HoaDon_ID;

        -- Cập nhật Vé 
        UPDATE Ve
        SET TrangThai = 'DaThanhToan'
        WHERE HoaDon_ID = @HoaDon_ID AND TrangThai = 'GiuCho';

        COMMIT TRANSACTION;

        -- Trả về thông tin thanh toán
        SELECT
            @TongCong AS TongTienGoc,
            @TienGiam AS TienGiam,
            @TongThanhToan AS TongThanhToan,
            N'Thanh toán thành công!' AS ThongBao;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
