const express = require('express');
const { getPool } = require('./db');

const router = express.Router();

const tierMap = {
  Thuong: 'Bronze',
  Bac: 'Silver',
  Vang: 'Gold',
  KimCuong: 'Platinum',
};

function normalizeMembershipTier(rawTier) {
  if (!rawTier) return 'Bronze';
  return tierMap[rawTier] || rawTier;
}

function formatDateToVN(dateValue) {
  if (!dateValue) return '';
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function queryCustomers(pool) {
  const result = await pool.request().query(`
    SELECT
      ND.ID,
      ND.HovaTendem,
      ND.Ten,
      KH.HangThanhVien,
      KH.DiemTichLuy
    FROM KhachHang KH
    INNER JOIN NguoiDung ND ON ND.ID = KH.NguoiDung_ID
    ORDER BY KH.DiemTichLuy DESC, ND.Ten ASC
  `);

  return result.recordset.map((row) => ({
    id: row.ID?.toString?.() ?? '',
    name: `${row.HovaTendem?.trim?.() || ''} ${row.Ten?.trim?.() || ''}`.trim(),
    membershipTier: normalizeMembershipTier(row.HangThanhVien),
    points: Number(row.DiemTichLuy) || 0,
  }));
}

async function queryEmployees(pool) {
  const result = await pool.request().query(`
    SELECT
      ND.ID,
      ND.HovaTendem,
      ND.Ten,
      NV.NgayVaoLam,
      NV.LuongCoBan
    FROM NhanVien NV
    INNER JOIN NguoiDung ND ON ND.ID = NV.NguoiDung_ID
    ORDER BY NV.LuongCoBan DESC, ND.Ten ASC
  `);

  return result.recordset.map((row) => ({
    id: row.ID?.toString?.() ?? '',
    name: `${row.HovaTendem?.trim?.() || ''} ${row.Ten?.trim?.() || ''}`.trim(),
    joinDate: formatDateToVN(row.NgayVaoLam),
    salary: Number(row.LuongCoBan) || 0,
  }));
}

router.use((req, res, next) => {
  try {
    getPool();
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Chưa đăng nhập. Vui lòng đăng nhập trước khi gọi API.',
    });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const pool = getPool();
    const customers = await queryCustomers(pool);
    res.json(customers);
  } catch (err) {
    console.error('Lỗi tải danh sách khách hàng:', err);
    res.status(500).json({ message: 'Không thể tải danh sách khách hàng.' });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const pool = getPool();
    const employees = await queryEmployees(pool);
    res.json(employees);
  } catch (err) {
    console.error('Lỗi tải danh sách nhân viên:', err);
    res.status(500).json({ message: 'Không thể tải danh sách nhân viên.' });
  }
});

module.exports = router;
