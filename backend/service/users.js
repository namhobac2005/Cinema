const express = require('express');
const sql = require('mssql');
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

function splitFullName(fullName = '') {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { hoVaTenDem: 'Khach', ten: 'Moi' };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { hoVaTenDem: '', ten: parts[0] };
  }

  const ten = parts.pop();
  return { hoVaTenDem: parts.join(' '), ten };
}

function formatDateISO(dateValue) {
  if (!dateValue) return '';
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

function mapCustomerRow(row) {
  return {
    id: row.ID?.toString?.() ?? '',
    name: `${row.HovaTendem?.trim?.() || ''} ${row.Ten?.trim?.() || ''}`.trim(),
    email: row.Email || '',
    phone: row.SoDienThoai || '',
    dateOfBirth: formatDateISO(row.NgaySinh),
    membershipTier: normalizeMembershipTier(row.HangThanhVien),
    points: Number(row.DiemTichLuy) || 0,
  };
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
      ND.Email,
      ND.SoDienThoai,
      ND.NgaySinh,
      KH.HangThanhVien,
      KH.DiemTichLuy
    FROM KhachHang KH
    INNER JOIN NguoiDung ND ON ND.ID = KH.NguoiDung_ID
    ORDER BY KH.DiemTichLuy DESC, ND.Ten ASC
  `);

  return result.recordset.map(mapCustomerRow);
}

async function getCustomerById(pool, customerId) {
  const result = await pool
    .request()
    .input('CustomerId', sql.Int, customerId)
    .query(`
      SELECT
        ND.ID,
        ND.HovaTendem,
        ND.Ten,
        ND.Email,
        ND.SoDienThoai,
        ND.NgaySinh,
        KH.HangThanhVien,
        KH.DiemTichLuy
      FROM KhachHang KH
      INNER JOIN NguoiDung ND ON ND.ID = KH.NguoiDung_ID
      WHERE ND.ID = @CustomerId
    `);

  if (!result.recordset.length) {
    return null;
  }

  return mapCustomerRow(result.recordset[0]);
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

router.post('/customers', async (req, res) => {
  const { name, phone, email, dateOfBirth, points = 0 } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Tên khách hàng không được để trống.' });
  }

  if (!phone || !phone.trim()) {
    return res.status(400).json({ message: 'Số điện thoại không được để trống.' });
  }

  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const { hoVaTenDem, ten } = splitFullName(name);
    const insertUserRequest = new sql.Request(transaction);
    const userResult = await insertUserRequest
      .input('HovaTendem', sql.NVarChar, hoVaTenDem)
      .input('Ten', sql.NVarChar, ten)
      .input('VaiTro', sql.VarChar, 'KhachHang')
      .input('SoDienThoai', sql.VarChar, phone)
      .input('Email', sql.VarChar, email || null)
      .input('NgaySinh', sql.Date, dateOfBirth ? new Date(dateOfBirth) : null)
      .query(`
        INSERT INTO NguoiDung (HovaTendem, Ten, VaiTro, SoDienThoai, Email, NgaySinh)
        OUTPUT INSERTED.ID
        VALUES (@HovaTendem, @Ten, @VaiTro, @SoDienThoai, @Email, @NgaySinh)
      `);

    const newUserId = userResult.recordset[0]?.ID;

    if (!newUserId) {
      throw new Error('Không thể tạo người dùng mới.');
    }

    const insertCustomerRequest = new sql.Request(transaction);
    await insertCustomerRequest
      .input('NguoiDungId', sql.Int, newUserId)
      .input('DiemTichLuy', sql.Int, Number(points) || 0)
      .query(`
        INSERT INTO KhachHang (NguoiDung_ID, HangThanhVien, DiemTichLuy)
        VALUES (@NguoiDungId, DEFAULT, @DiemTichLuy)
      `);

    await transaction.commit();

    const createdCustomer = await getCustomerById(pool, newUserId);
    res.status(201).json(createdCustomer);
  } catch (err) {
    console.error('Lỗi tạo khách hàng:', err);
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      console.error('Rollback thất bại:', rollbackErr);
    }
    res.status(500).json({ message: 'Không thể tạo khách hàng.' });
  }
});

router.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const customerId = Number.parseInt(id, 10);

  if (!Number.isInteger(customerId)) {
    return res.status(400).json({ message: 'ID khách hàng không hợp lệ.' });
  }

  const { name, phone, email, dateOfBirth, points } = req.body || {};

  if (!name && !phone && typeof email === 'undefined' && typeof dateOfBirth === 'undefined' && typeof points === 'undefined') {
    return res.status(400).json({ message: 'Không có dữ liệu nào để cập nhật.' });
  }

  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const updateUserFields = [];
    const userRequest = new sql.Request(transaction).input('CustomerId', sql.Int, customerId);

    if (name) {
      const { hoVaTenDem, ten } = splitFullName(name);
      updateUserFields.push('HovaTendem = @HovaTendem', 'Ten = @Ten');
      userRequest.input('HovaTendem', sql.NVarChar, hoVaTenDem);
      userRequest.input('Ten', sql.NVarChar, ten);
    }

    if (typeof phone !== 'undefined') {
      updateUserFields.push('SoDienThoai = @SoDienThoai');
      userRequest.input('SoDienThoai', sql.VarChar, phone || null);
    }

    if (typeof email !== 'undefined') {
      updateUserFields.push('Email = @Email');
      userRequest.input('Email', sql.VarChar, email || null);
    }

    if (typeof dateOfBirth !== 'undefined') {
      updateUserFields.push('NgaySinh = @NgaySinh');
      userRequest.input('NgaySinh', sql.Date, dateOfBirth ? new Date(dateOfBirth) : null);
    }

    if (updateUserFields.length) {
      await userRequest.query(`
        UPDATE NguoiDung
        SET ${updateUserFields.join(', ')}
        WHERE ID = @CustomerId AND VaiTro = 'KhachHang'
      `);
    }

    const updateCustomerFields = [];
    const customerRequest = new sql.Request(transaction).input('CustomerId', sql.Int, customerId);

    if (typeof points !== 'undefined') {
      updateCustomerFields.push('DiemTichLuy = @DiemTichLuy');
      customerRequest.input('DiemTichLuy', sql.Int, Number(points) || 0);
    }

    if (updateCustomerFields.length) {
      await customerRequest.query(`
        UPDATE KhachHang
        SET ${updateCustomerFields.join(', ')}
        WHERE NguoiDung_ID = @CustomerId
      `);
    }

    await transaction.commit();

    const updatedCustomer = await getCustomerById(pool, customerId);
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    }

    res.json(updatedCustomer);
  } catch (err) {
    console.error('Lỗi cập nhật khách hàng:', err);
    try {
      await transaction.rollback();
    } catch (rollbackErr) {
      console.error('Rollback thất bại:', rollbackErr);
    }
    res.status(500).json({ message: 'Không thể cập nhật khách hàng.' });
  }
});

router.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const customerId = Number.parseInt(id, 10);

  if (!Number.isInteger(customerId)) {
    return res.status(400).json({ message: 'ID khách hàng không hợp lệ.' });
  }

  try {
    const pool = getPool();
    const result = await pool
      .request()
      .input('CustomerId', sql.Int, customerId)
      .query(`
        DELETE FROM NguoiDung
        WHERE ID = @CustomerId AND VaiTro = 'KhachHang'
      `);

    if (!result.rowsAffected?.[0]) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi xóa khách hàng:', err);
    res.status(500).json({ message: 'Không thể xóa khách hàng.' });
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
