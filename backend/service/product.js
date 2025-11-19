const express = require("express");
const sql = require("mssql");
const { getPool } = require("./db");

const router = express.Router();

// Convert category FE <-> DB
const mapCategory = {
  "Thức Ăn": "ThucAn",
  "Nước uống": "NuocUong",
  Combo: "Combo"
};

const reverseCategory = {
  ThucAn: "Thức Ăn",
  NuocUong: "Nước uống",
  Combo: "Combo"
};

/** GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  try {
    const type = req.query.type ? mapCategory[req.query.type] : null;
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT * FROM SanPham ${type ? `WHERE PhanLoai='${type}'` : ""}
    `);

    const products = [];

    for (const sp of result.recordset) {
      const category = reverseCategory[sp.PhanLoai];

      let detail = null;
      if (sp.PhanLoai === "ThucAn") {
        detail = (
          await pool.request().query(`SELECT * FROM ThucAn WHERE SanPham_ID=${sp.ID}`)
        ).recordset[0] || null;
      } else if (sp.PhanLoai === "NuocUong") {
        detail = (
          await pool.request().query(`SELECT * FROM NuocUong WHERE SanPham_ID=${sp.ID}`)
        ).recordset[0] || null;
      } else {
        detail = (
          await pool.request().query(`SELECT * FROM Combo WHERE SanPham_ID=${sp.ID}`)
        ).recordset[0] || null;
      }

      products.push({
        id: sp.ID,
        name: sp.TenSP,
        price: Number(sp.DonGia),
        stock: sp.TonKho,
        supplier: sp.NhaPhanPhoi,
        category,
        ...(category === "Thức Ăn"
          ? {
              weight: detail?.TrongLuong ? Number(detail.TrongLuong) : null,
              flavor: detail?.Vi || null
            }
          : category === "Nước uống"
          ? {
              volume: detail?.TheTich ? Number(detail.TheTich) : null,
              hasGas: Boolean(detail?.CoGas)
            }
          : {
              description: detail?.MoTa || null
            })
      });
    }

    res.json(products);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
  }
});

/** CREATE PRODUCT */
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const dbType = mapCategory[data.category];
    const pool = await getPool();

    // INSERT SANPHAM
    const result = await pool.request()
      .input("TenSP", sql.NVarChar, data.name)
      .input("DonGia", sql.Decimal(10, 2), data.price)
      .input("TonKho", sql.Int, data.stock)
      .input("PhanLoai", sql.VarChar, dbType)
      .input("NhaPhanPhoi", sql.NVarChar, data.supplier)
      .query(`
        INSERT INTO SanPham (TenSP, DonGia, TonKho, PhanLoai, NhaPhanPhoi)
        VALUES (@TenSP, @DonGia, @TonKho, @PhanLoai, @NhaPhanPhoi);
        SELECT SCOPE_IDENTITY() AS ID;
      `);

    const newId = result.recordset[0].ID;

    // Insert detail based on category
    if (dbType === "ThucAn") {
      await pool.request()
        .input("ID", newId)
        .input("TrongLuong", sql.Float, data.weight ? data.weight : null)
        .input("Vi", sql.NVarChar, data.flavor || null)
        .query(`INSERT INTO ThucAn VALUES (@ID, @TrongLuong, @Vi)`);
    } else if (dbType === "NuocUong") {
      await pool.request()
        .input("ID", newId)
        .input("TheTich", sql.Float, data.volume ? data.volume : null)
        .input("CoGas", sql.Bit, data.hasGas ? 1 : 0)
        .query(`INSERT INTO NuocUong VALUES (@ID, @TheTich, @CoGas)`);
    } else {
      await pool.request()
        .input("ID", newId)
        .input("MoTa", sql.NVarChar, data.description || null)
        .query(`INSERT INTO Combo VALUES (@ID, @MoTa)`);
    }

    res.status(201).json({ message: "Thêm sản phẩm thành công" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Không thể thêm sản phẩm" });
  }
});

/** UPDATE PRODUCT */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dbType = mapCategory[data.category];

    const pool = await getPool();

    // 1. UPDATE bảng SanPham
    await pool.request()
      .input("ID", sql.Int, id)
      .input("TenSP", sql.NVarChar, data.name)
      .input("DonGia", sql.Decimal(10,2), data.price)
      .input("TonKho", sql.Int, data.stock)
      .input("PhanLoai", sql.VarChar, dbType)
      .input("NhaPhanPhoi", sql.NVarChar, data.supplier)
      .query(`
        UPDATE SanPham 
        SET TenSP=@TenSP, DonGia=@DonGia, TonKho=@TonKho, PhanLoai=@PhanLoai, NhaPhanPhoi=@NhaPhanPhoi
        WHERE ID=@ID;
      `);

    // 2. Cập nhật bảng chi tiết theo loại
    if (dbType === "ThucAn") {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("TrongLuong", sql.VarChar, data.weight)
        .input("Vi", sql.NVarChar, data.flavor)
        .query(`
          UPDATE ThucAn 
          SET TrongLuong=@TrongLuong, Vi=@Vi 
          WHERE SanPham_ID=@ID;
        `);

    } else if (dbType === "NuocUong") {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("TheTich", sql.VarChar, data.volume)
        .input("CoGas", sql.Bit, data.hasGas ? 1 : 0)
        .query(`
          UPDATE NuocUong 
          SET TheTich=@TheTich, CoGas=@CoGas 
          WHERE SanPham_ID=@ID;
        `);

    } else {
      await pool.request()
        .input("ID", sql.Int, id)
        .input("MoTa", sql.NVarChar, data.description)
        .query(`
          UPDATE Combo 
          SET MoTa=@MoTa 
          WHERE SanPham_ID=@ID;
        `);
    }

    res.json({ message: "Cập nhật sản phẩm thành công" });

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Không thể cập nhật sản phẩm" });
  }
});


/** DELETE PRODUCT */
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query(`DELETE FROM SanPham WHERE ID=${req.params.id}`);
    res.json({ message: "Xóa thành công" });
  } catch (e) {
    res.status(500).json({ message: "Không thể xóa" });
  }
});

module.exports = router;
