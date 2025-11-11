const sql = require('mssql');

async function getDashboardStats(pool) {
  try {
    const request = pool.request();

    // 1. Gọi Function tính doanh thu hôm nay
    const revenueResult = await request.query(
      'SELECT dbo.fn_TinhDoanhThuHomNay() AS DoanhThuHomNay'
    );

    // 2. Đếm vé bán hôm nay
    const ticketsResult = await request.query(`
                SELECT COUNT(v.ID) AS VeBanHomNay
                FROM Ve v
                JOIN HoaDon h ON v.HoaDon_ID = h.ID
                WHERE h.TrangThaiThanhToan = 'DaThanhToan'
                AND CONVERT(date, h.ThoiGianTao) = CONVERT(date, GETDATE())
            `);

    // 3. Đếm suất chiếu đang hoạt động
    const showtimesResult = await request.query(
      "SELECT COUNT(ID) AS SuatChieuHoatDong FROM SuatChieu WHERE TrangThai = 'DangMo'"
    );

    // 4. Gom tất cả lại
    const stats = {
      doanhThuHomNay: revenueResult.recordset[0].DoanhThuHomNay,
      veBanHomNay: ticketsResult.recordset[0].VeBanHomNay,
      suatChieuHoatDong: showtimesResult.recordset[0].SuatChieuHoatDong,
    };

    return stats;
  } catch (err) {
    console.error('Lỗi khi lấy dashboard stats:', err.message);
    throw new Error('Lỗi khi truy vấn CSDL cho dashboard');
  }
}

module.exports = { getDashboardStats };
