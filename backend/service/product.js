const express = require("express");
const router = express.Router();
const { sql, getPool } = require("./db");

// Mapping UI ↔ DB
const UI_TO_DB = {
  "Thức Ăn": "ThucAn",
  "Nước uống": "NuocUong",
  "Combo": "Combo"
};

const DB_TO_UI = {
  ThucAn: "Thức Ăn",
  NuocUong: "Nước uống",
  Combo: "Combo"
};

/** ==================== 📌 GET ALL PRODUCTS ==================== */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT SP.*, TA.TrongLuong, TA.Vi,
             NU.TheTich, NU.CoGas,
             CB.MoTa
      FROM SanPham SP
      LEFT JOIN ThucAn TA ON SP.ID = TA.SanPham_ID
      LEFT JOIN NuocUong NU ON SP.ID = NU.SanPham_ID
      LEFT JOIN Combo CB ON SP.ID = CB.SanPham_ID
      ORDER BY SP.ID DESC;
    `);

    const data = result.recordset.map((p) => ({
      id: p.ID,
      name: p.TenSP,
      price: Number(p.DonGia),
      stock: Number(p.TonKho),
      supplier: p.NhaPhanPhoi,
      category: DB_TO_UI[p.PhanLoai],
      weight: p.TrongLuong,
      flavor: p.Vi,
      volume: p.TheTich,
      hasGas: p.CoGas,
      description: p.MoTa,
    }));

    res.json(data);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

/** ==================== 📌 ADD PRODUCT ==================== */
router.post("/", async (req, res) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    const data = req.body;
    let type = UI_TO_DB[data.category];

    if (!type) return res.status(400).json({ message: "Loại sản phẩm không hợp lệ" });

    await transaction.begin();
    const reqSP = new sql.Request(transaction);

    // Insert SanPham
    const insertSP = await reqSP
      .input("TenSP", sql.NVarChar, data.name)
      .input("DonGia", sql.Decimal(18, 0), data.price)
      .input("TonKho", sql.Int, data.stock)
      .input("NPP", sql.NVarChar, data.supplier)
      .input("Loai", sql.VarChar, type)
      .query(`
        INSERT INTO SanPham (TenSP, DonGia, TonKho, NhaPhanPhoi, PhanLoai)
        OUTPUT INSERTED.ID
        VALUES (@TenSP, @DonGia, @TonKho, @NPP, @Loai)
      `);

    const newID = insertSP.recordset[0].ID;
    const reqDetail = new sql.Request(transaction);

    // Insert type detail
    if (type === "ThucAn") {
      await reqDetail
        .input("ID", sql.Int, newID)
        .input("TL", sql.NVarChar, data.weight)
        .input("Vi", sql.NVarChar, data.flavor)
        .query(`INSERT INTO ThucAn VALUES (@ID, @TL, @Vi)`);
    } else if (type === "NuocUong") {
      await reqDetail
        .input("ID", sql.Int, newID)
        .input("TT", sql.NVarChar, data.volume)
        .input("Gas", sql.Bit, data.hasGas ? 1 : 0)
        .query(`INSERT INTO NuocUong VALUES (@ID, @TT, @Gas)`);
    } else {
      await reqDetail
        .input("ID", sql.Int, newID)
        .input("MT", sql.NVarChar, data.description)
        .query(`INSERT INTO Combo VALUES (@ID, @MT)`);
    }

    await transaction.commit();
    res.json({ message: "Thêm sản phẩm thành công", id: newID });

  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
  }
});

/** ==================== 📌 UPDATE PRODUCT (Bạn gửi) ==================== */
// 👉 Giữ nguyên code UPDATE bạn đã gửi bên trên
// (Không cần sửa)

/** ==================== 📌 DELETE PRODUCT ==================== */
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const id = req.params.id;

    const result = await pool.request().input("ID", sql.Int, id)
      .query("DELETE FROM SanPham WHERE ID=@ID");

    if (result.rowsAffected[0] === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json({ message: "Xóa thành công" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
});

module.exports = router;
