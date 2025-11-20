const express = require("express");
const router = express.Router();
const { sql, getPool } = require("./db");

/**
 * TẠO BẢNG SanPham_Status (NẾU CHƯA CÓ)
 * -> Lưu trạng thái xoá mềm
 * Chỉ chạy khi file này được require.
 */
async function ensureStatusTable() {
  try {
    const pool = await getPool();
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SanPham_Status')
      CREATE TABLE SanPham_Status (
        SanPham_ID INT PRIMARY KEY,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_SanPham_Status FOREIGN KEY (SanPham_ID)
            REFERENCES SanPham(ID) ON DELETE CASCADE
      );
    `);
  } catch (err) {
    console.error("❌ Lỗi tạo bảng SanPham_Status:", err.message);
  }
}


// 🌎 Mapping UI ↔ DB
const UI_TO_DB = {
  "Thức Ăn": "ThucAn",
  "Nước uống": "NuocUong",
  "Combo": "Combo",
};

const DB_TO_UI = {
  ThucAn: "Thức Ăn",
  NuocUong: "Nước uống",
  Combo: "Combo",
};

/** ==================== 📌 GET ALL PRODUCTS ==================== */
router.get("/", async (req, res) => {
  try {
    await ensureStatusTable();
    const includeDeleted = req.query.all === "true";
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        SP.*, 
        TA.TrongLuong, TA.Vi,
        NU.TheTich, NU.CoGas,
        CB.MoTa,
        ISNULL(ST.IsDeleted, 0) AS IsDeleted
      FROM SanPham SP
      LEFT JOIN SanPham_Status ST ON SP.ID = ST.SanPham_ID
      LEFT JOIN ThucAn TA       ON SP.ID = TA.SanPham_ID
      LEFT JOIN NuocUong NU     ON SP.ID = NU.SanPham_ID
      LEFT JOIN Combo CB        ON SP.ID = CB.SanPham_ID
      ORDER BY SP.ID DESC;
    `);

    let data = result.recordset.map((p) => ({
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
      deleted: Boolean(p.IsDeleted),
    }));

    // Mặc định: chỉ trả về sản phẩm chưa bị ẩn
    if (!includeDeleted) {
      data = data.filter((p) => !p.deleted);
    }

    res.json(data);
  } catch (err) {
    console.error("GET /products ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/** ==================== 📌 ADD PRODUCT ==================== */
router.post("/", async (req, res) => {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    const data = req.body;
    const type = UI_TO_DB[data.category];
    if (!type)
      return res.status(400).json({ message: "Loại sản phẩm không hợp lệ" });

    await transaction.begin();

    const insertSP = await new sql.Request(transaction)
      .input("TenSP", sql.NVarChar, data.name)
      .input("DonGia", sql.Decimal(18, 0), data.price)
      .input("TonKho", sql.Int, data.stock)
      .input("NPP", sql.NVarChar, data.supplier)
      .input("Loai", sql.VarChar, type)
      .query(`
        INSERT INTO SanPham (TenSP, DonGia, TonKho, NhaPhanPhoi, PhanLoai)
        OUTPUT INSERTED.ID
        VALUES (@TenSP, @DonGia, @TonKho, @NPP, @Loai);
      `);

    const newID = insertSP.recordset[0].ID;

    if (type === "ThucAn") {
      await new sql.Request(transaction)
        .input("ID", sql.Int, newID)
        .input("TL", sql.NVarChar, data.weight)
        .input("VI", sql.NVarChar, data.flavor)
        .query(`INSERT INTO ThucAn VALUES (@ID, @TL, @VI)`);
    } else if (type === "NuocUong") {
      await new sql.Request(transaction)
        .input("ID", sql.Int, newID)
        .input("TT", sql.NVarChar, data.volume)
        .input("Gas", sql.Bit, data.hasGas ? 1 : 0)
        .query(`INSERT INTO NuocUong VALUES (@ID, @TT, @Gas)`);
    } else {
      await new sql.Request(transaction)
        .input("ID", sql.Int, newID)
        .input("MT", sql.NVarChar, data.description)
        .query(`INSERT INTO Combo VALUES (@ID, @MT)`);
    }

    await transaction.commit();
    res.json({ message: "Thêm sản phẩm thành công", id: newID });
  } catch (err) {
    console.error("POST /products ERROR:", err);
    await transaction.rollback();
    res.status(500).json({ message: err.message });
  }
});

/** ==================== 📌 DELETE (XOÁ MỀM) ==================== */
router.delete("/:id", async (req, res) => {
  try {
    await ensureStatusTable();
    const pool = await getPool();
    const id = Number(req.params.id);

    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`
        MERGE SanPham_Status AS S
        USING (SELECT @ID AS ID) AS X
        ON S.SanPham_ID = X.ID
        WHEN MATCHED THEN 
          UPDATE SET IsDeleted = 1
        WHEN NOT MATCHED THEN 
          INSERT (SanPham_ID, IsDeleted) VALUES (@ID, 1);
      `);

    console.log("DELETE /products:", { id, rowsAffected: result.rowsAffected });

    res.json({ message: "Ẩn sản phẩm thành công" });
  } catch (err) {
    console.error("DELETE /products ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/** ==================== 📌 UPDATE PRODUCT ==================== */
router.put("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const id = req.params.id;
    const data = req.body;

    // 🛑 Không cho đổi loại
    const old = await pool.request()
      .input("ID", sql.Int, id)
      .query(`SELECT PhanLoai FROM SanPham WHERE ID=@ID`);

    if (old.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    if (old.recordset[0].PhanLoai !== UI_TO_DB[data.category])
      return res.status(400).json({ message: "Phân loại sản phẩm không thể thay đổi!" });

    // 📌 Update bảng chính
    await pool.request()
      .input("ID", sql.Int, id)
      .input("TenSP", sql.NVarChar, data.name)
      .input("DonGia", sql.Decimal(18,0), data.price)
      .input("TonKho", sql.Int, data.stock)
      .input("NPP", sql.NVarChar, data.supplier)
      .query(`
        UPDATE SanPham SET 
          TenSP=@TenSP, DonGia=@DonGia,
          TonKho=@TonKho, NhaPhanPhoi=@NPP
        WHERE ID=@ID;
      `);

    // 📌 Update bảng con
    if (data.category === "Thức Ăn") {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("TL", sql.NVarChar, data.weight)
        .input("Vi", sql.NVarChar, data.flavor)
        .query(`UPDATE ThucAn SET TrongLuong=@TL, Vi=@Vi WHERE SanPham_ID=@ID`);
    } else if (data.category === "Nước uống") {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("TT", sql.NVarChar, data.volume)
        .input("Gas", sql.Bit, data.hasGas ? 1 : 0)
        .query(`UPDATE NuocUong SET TheTich=@TT, CoGas=@Gas WHERE SanPham_ID=@ID`);
    } else {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("MT", sql.NVarChar, data.description)
        .query(`UPDATE Combo SET MoTa=@MT WHERE SanPham_ID=@ID`);
    }

    res.json({ message: "Cập nhật sản phẩm thành công" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
