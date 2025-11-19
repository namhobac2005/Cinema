// backend/service/invoice.js
const express = require("express");
const router = express.Router();
const { getPool, sql } = require("./db"); // CHÍNH XÁC: ./db

// 📌 GET: Danh sách hóa đơn
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT 
        hd.ID AS HoaDonID,
        hd.ThoiGianTao,
        hd.TrangThaiThanhToan,
        hd.PhuongThucThanhToan,
        (nd_kh.HovaTendem + ' ' + nd_kh.Ten) AS KhachHang,
        (nd_nv.HovaTendem + ' ' + nd_nv.Ten) AS NhanVien,
        (SELECT SUM(SoLuong * DonGiaLucBan) FROM HoaDon_SanPham WHERE HoaDon_ID = hd.ID) AS TongTien
      FROM HoaDon hd
      LEFT JOIN KhachHang kh ON hd.KhachHang_ID = kh.NguoiDung_ID
      LEFT JOIN NguoiDung nd_kh ON kh.NguoiDung_ID = nd_kh.ID
      LEFT JOIN NhanVien nv ON hd.NhanVien_ID = nv.NguoiDung_ID
      LEFT JOIN NguoiDung nd_nv ON nv.NguoiDung_ID = nd_nv.ID
      ORDER BY hd.ID DESC;
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ LỖI GET /invoice:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 📌 GET: Chi tiết hóa đơn theo ID
router.get("/:id", async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const invoice = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          hd.ID AS HoaDonID,
          hd.ThoiGianTao,
          hd.TrangThaiThanhToan,
          hd.PhuongThucThanhToan,
          (nd_kh.HovaTendem + ' ' + nd_kh.Ten) AS KhachHang,
          (nd_nv.HovaTendem + ' ' + nd_nv.Ten) AS NhanVien
        FROM HoaDon hd
        LEFT JOIN KhachHang kh ON hd.KhachHang_ID = kh.NguoiDung_ID
        LEFT JOIN NguoiDung nd_kh ON kh.NguoiDung_ID = nd_kh.ID
        LEFT JOIN NhanVien nv ON hd.NhanVien_ID = nv.NguoiDung_ID
        LEFT JOIN NguoiDung nd_nv ON nv.NguoiDung_ID = nd_nv.ID
        WHERE hd.ID = @id;
      `);

    if (invoice.recordset.length === 0)
      return res.status(404).json({ error: "Không tìm thấy hóa đơn" });

    const items = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          sp.ID AS SanPhamID,
          sp.TenSP AS TenSanPham,
          hdsp.SoLuong,
          hdsp.DonGiaLucBan,
          (hdsp.SoLuong * hdsp.DonGiaLucBan) AS ThanhTien
        FROM HoaDon_SanPham hdsp
        JOIN SanPham sp ON hdsp.SanPham_ID = sp.ID
        WHERE hdsp.HoaDon_ID = @id;
      `);

    res.json({
      ...invoice.recordset[0],
      SanPham: items.recordset
    });

  } catch (err) {
    console.error("❌ LỖI GET /invoice/:id:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});


module.exports = router;
