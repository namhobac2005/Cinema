const express = require('express');
const { getPool } = require('./db');
const router = express.Router();

router.use((req, res, next) => {
  try {
    getPool();
    next();
  } catch (err) {
    res.status(401).json({ message: 'Chưa đăng nhập.' });
  }
});

// NHÓM 1: KPI STATS 
// API: GET /reports/stats/revenue-month
router.get('/stats/revenue-month', async (req, res) => {
  try {
    const pool = getPool();
    const query = `
      DECLARE @StartThisMonth DATE = DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1);
      DECLARE @StartLastMonth DATE = DATEADD(MONTH, -1, @StartThisMonth);

      DECLARE @RevThisMonth DECIMAL(18,2) = (
        SELECT 
          ISNULL((SELECT SUM(GiaVeBan) FROM Ve v JOIN HoaDon h ON v.HoaDon_ID = h.ID WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= @StartThisMonth), 0) 
          + 
          ISNULL((SELECT SUM(SoLuong * DonGiaLucBan) FROM HoaDon_SanPham hsp JOIN HoaDon h ON hsp.HoaDon_ID = h.ID WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= @StartThisMonth), 0)
      );

      DECLARE @RevLastMonth DECIMAL(18,2) = (
        SELECT 
          ISNULL((SELECT SUM(GiaVeBan) FROM Ve v JOIN HoaDon h ON v.HoaDon_ID = h.ID WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= @StartLastMonth AND h.ThoiGianTao < @StartThisMonth), 0) 
          + 
          ISNULL((SELECT SUM(SoLuong * DonGiaLucBan) FROM HoaDon_SanPham hsp JOIN HoaDon h ON hsp.HoaDon_ID = h.ID WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= @StartLastMonth AND h.ThoiGianTao < @StartThisMonth), 0)
      );

      DECLARE @Change DECIMAL(10, 2) = 0;
      IF @RevLastMonth > 0
        SET @Change = ((@RevThisMonth - @RevLastMonth) / @RevLastMonth) * 100;
      ELSE IF @RevThisMonth > 0
        SET @Change = 100;

      SELECT @RevThisMonth AS value, @Change AS change;
    `;
    const result = await pool.request().query(query);
    res.json(result.recordset[0]);
  } catch (err) { console.error(err); res.status(500).send(err.message); }
});

// API: GET /reports/stats/tickets-month
router.get('/stats/tickets-month', async (req, res) => {
  try {
    const pool = getPool();
    const query = `
      DECLARE @StartThisMonth DATE = DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1);
      DECLARE @StartLastMonth DATE = DATEADD(MONTH, -1, @StartThisMonth);

      DECLARE @TicketThisMonth INT = (
        SELECT COUNT(v.ID) FROM Ve v JOIN HoaDon h ON v.HoaDon_ID = h.ID
        WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND v.TrangThai = 'DaThanhToan' AND h.ThoiGianTao >= @StartThisMonth
      );

      DECLARE @TicketLastMonth INT = (
        SELECT COUNT(v.ID) FROM Ve v JOIN HoaDon h ON v.HoaDon_ID = h.ID
        WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND v.TrangThai = 'DaThanhToan' AND h.ThoiGianTao >= @StartLastMonth AND h.ThoiGianTao < @StartThisMonth
      );

      DECLARE @Change DECIMAL(10, 2) = 0;
      IF @TicketLastMonth > 0 SET @Change = ((CAST(@TicketThisMonth AS DECIMAL) - @TicketLastMonth) / @TicketLastMonth) * 100;
      ELSE IF @TicketThisMonth > 0 SET @Change = 100;

      SELECT @TicketThisMonth AS value, @Change AS change;
    `;
    const result = await pool.request().query(query);
    res.json(result.recordset[0]);
  } catch (err) { console.error(err); res.status(500).send(err.message); }
});

// API: GET /reports/stats/general
router.get('/stats/general', async (req, res) => {
  try {
    const pool = getPool();
    const query = `
      SELECT 
        (SELECT COUNT(ID) FROM Phim WHERE TrangThaiPhim = 'DangChieu') AS moviesShowing,
        (SELECT COUNT(ID) FROM SuatChieu WHERE TrangThai = 'DangMo' AND CAST(ThoiGianBatDau AS DATE) = CAST(GETDATE() AS DATE)) AS showtimesToday
    `;
    const result = await pool.request().query(query);
    res.json(result.recordset[0]);
  } catch (err) { console.error(err); res.status(500).send(err.message); }
});

// NHÓM 2: BIỂU ĐỒ 

// API: GET /reports/charts/6months
router.get('/charts/6months', async (req, res) => {
  try {
    const pool = getPool();
    const query = `
      DECLARE @HomNay DATE = GETDATE();
      
      ;WITH Thang AS (
        SELECT 0 AS Offset, FORMAT(@HomNay, 'yyyy-MM') AS MaThang, 'T' + FORMAT(@HomNay, 'MM') AS TenHienThi
        UNION ALL
        SELECT Offset - 1, FORMAT(DATEADD(MONTH, Offset - 1, @HomNay), 'yyyy-MM'), 'T' + FORMAT(DATEADD(MONTH, Offset - 1, @HomNay), 'MM')
        FROM Thang WHERE Offset > -5
      ),
      DataVe AS (
         SELECT FORMAT(h.ThoiGianTao, 'yyyy-MM') as Thang, SUM(v.GiaVeBan) as TienVe, COUNT(v.ID) as SoVe
         FROM HoaDon h JOIN Ve v ON h.ID = v.HoaDon_ID
         WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= DATEADD(MONTH, -5, DATEFROMPARTS(YEAR(@HomNay), MONTH(@HomNay), 1))
         GROUP BY FORMAT(h.ThoiGianTao, 'yyyy-MM')
      ),
      DataSP AS (
         SELECT FORMAT(h.ThoiGianTao, 'yyyy-MM') as Thang, SUM(hsp.SoLuong * hsp.DonGiaLucBan) as TienSP
         FROM HoaDon h JOIN HoaDon_SanPham hsp ON h.ID = hsp.HoaDon_ID
         WHERE h.TrangThaiThanhToan = 'DaThanhToan' AND h.ThoiGianTao >= DATEADD(MONTH, -5, DATEFROMPARTS(YEAR(@HomNay), MONTH(@HomNay), 1))
         GROUP BY FORMAT(h.ThoiGianTao, 'yyyy-MM')
      )
      SELECT 
        t.TenHienThi AS month,
        ISNULL(dv.TienVe, 0) + ISNULL(dsp.TienSP, 0) AS revenue,
        ISNULL(dv.SoVe, 0) AS tickets
      FROM Thang t
      LEFT JOIN DataVe dv ON t.MaThang = dv.Thang
      LEFT JOIN DataSP dsp ON t.MaThang = dsp.Thang
      ORDER BY t.MaThang;
    `;
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) { console.error(err); res.status(500).send(err.message); }
});

// NHÓM 3: TABLES

// API: GET /reports/tables/recent-movies
router.get('/tables/recent-movies', async (req, res) => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT TOP 5 p.ID, p.TenPhim AS title, 
    (SELECT TOP 1 TenLoaiPhim FROM LoaiPhim lp WHERE lp.Phim_ID = p.ID) AS genre,
    p.TrangThaiPhim AS status, dbo.fn_TinhTongDoanhThuPhim(p.ID) AS revenue
    FROM Phim p ORDER BY p.NgayPhatHanh DESC
  `);
  res.json(result.recordset);
});

// API: GET /reports/tables/all-movies
router.get('/tables/all-movies', async (req, res) => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT p.ID, p.TenPhim AS title, 
    (SELECT TOP 1 TenLoaiPhim FROM LoaiPhim lp WHERE lp.Phim_ID = p.ID) AS genre,
    p.TrangThaiPhim AS status, dbo.fn_TinhTongDoanhThuPhim(p.ID) AS revenue
    FROM Phim p ORDER BY p.ID DESC
  `);
  res.json(result.recordset);
});

// API: GET /reports/tables/recent-invoices
router.get('/tables/recent-invoices', async (req, res) => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT TOP 5 '#INV-' + CAST(h.ID AS VARCHAR) AS id,
    ISNULL(nd.HovaTendem + ' ' + nd.Ten, N'Khách vãng lai') AS customer,
    (ISNULL((SELECT SUM(GiaVeBan) FROM Ve v WHERE v.HoaDon_ID = h.ID), 0) + dbo.fn_TinhTongTienSanPham(h.ID)) AS amount,
    h.ThoiGianTao AS date, h.TrangThaiThanhToan AS status
    FROM HoaDon h LEFT JOIN KhachHang kh ON h.KhachHang_ID = kh.NguoiDung_ID LEFT JOIN NguoiDung nd ON kh.NguoiDung_ID = nd.ID
    ORDER BY h.ThoiGianTao DESC
  `);
  res.json(result.recordset);
});

// API: GET /reports/tables/all-invoices
router.get('/tables/all-invoices', async (req, res) => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT '#INV-' + CAST(h.ID AS VARCHAR) AS id,
    ISNULL(nd.HovaTendem + ' ' + nd.Ten, N'Khách vãng lai') AS customer,
    (ISNULL((SELECT SUM(GiaVeBan) FROM Ve v WHERE v.HoaDon_ID = h.ID), 0) + dbo.fn_TinhTongTienSanPham(h.ID)) AS amount,
    h.ThoiGianTao AS date, h.TrangThaiThanhToan AS status
    FROM HoaDon h LEFT JOIN KhachHang kh ON h.KhachHang_ID = kh.NguoiDung_ID LEFT JOIN NguoiDung nd ON kh.NguoiDung_ID = nd.ID
    ORDER BY h.ThoiGianTao DESC
  `);
  res.json(result.recordset);
});

// API: GET /reports/tables/top-products
router.get('/tables/top-products', async (req, res) => {
  const pool = getPool();
  const result = await pool.request().query("SELECT TOP 5 sp.TenSP AS name, SUM(hsp.SoLuong) AS sold, SUM(hsp.SoLuong * hsp.DonGiaLucBan) AS revenue FROM HoaDon_SanPham hsp JOIN SanPham sp ON hsp.SanPham_ID = sp.ID WHERE sp.PhanLoai <> 'Combo' GROUP BY sp.TenSP ORDER BY sold DESC");
  res.json(result.recordset);
});

module.exports = router;