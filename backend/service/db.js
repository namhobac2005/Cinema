// db.js
const sql = require('mssql');
require('dotenv').config();

let appPool = null; 
const DEFAULT_ROLE = 'KhachHang';

const connectDB = async () => {
    const config = {
      server: process.env.DB_SERVER || 'localhost',
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        trustServerCertificate: true,
      },
    };
  
    try {
      // Tạo pool MỘT LẦN
      appPool = new sql.ConnectionPool(config);
      await appPool.connect();
      console.log('Đã kết nối CSDL. Pool đã sẵn sàng.');
    } catch (err) {
      console.error('LỖI KẾT NỐI CSDL KHI KHỞI ĐỘNG:', err.message);
      process.exit(1);
    }
  };

// ⭐ CẬP NHẬT: Nhận các tham số chi tiết từ frontend
const registerUser = async (hoTenDem, ten, ngaySinh, soDienThoai, email, password) => {
    if (!appPool) {
        throw new Error('Pool CSDL chưa được khởi tạo!');
    }

    const tenNguoiDung = ten; 
    const ngaySinhValue = ngaySinh || null; // Dùng giá trị nhận được, hoặc NULL
    const soDienThoaiValue = soDienThoai || null; 
    const diemTichLuy = 0; 
    const hashedPassword = password

    const transaction = new sql.Transaction(appPool);
    let newUserId = null; 

    try {
        await transaction.begin();

        // ----------------------------------------------------
        // BƯỚC 1: KIỂM TRA NGƯỜI DÙNG CŨ CẦN CẬP NHẬT (SĐT khớp và Email IS NULL)
        // ----------------------------------------------------
        const checkUserQuery = `
            SELECT ID 
            FROM NguoiDung 
            WHERE SoDienThoai = @SoDienThoai AND Email IS NULL;
        `;
        const checkRequest = new sql.Request(transaction);
        checkRequest.input('SoDienThoai', sql.VarChar(15), soDienThoaiValue);
        const existingUserResult = await checkRequest.query(checkUserQuery);

        if (existingUserResult.recordset.length > 0) {
            // SCENARIO A: CẬP NHẬT (COMPLETION) HỒ SƠ CŨ
            newUserId = existingUserResult.recordset[0].ID;

            const updateNguoiDung = `
                UPDATE NguoiDung 
                SET Email = @Email, MatKhau = @MatKhau, NgaySinh = @NgaySinh, 
                    HovaTendem = @HovaTendem, Ten = @Ten
                WHERE ID = @ID;
            `;
            const updateRequest = new sql.Request(transaction);
            updateRequest.input('ID', sql.Int, newUserId);
            updateRequest.input('Email', sql.VarChar(100), email);
            updateRequest.input('MatKhau', sql.VarChar(255), hashedPassword);
            updateRequest.input('NgaySinh', sql.Date, ngaySinhValue);
            updateRequest.input('HovaTendem', sql.NVarChar(100), hoTenDem);
            updateRequest.input('Ten', sql.NVarChar(100), tenNguoiDung);

            await updateRequest.query(updateNguoiDung);

            // Không cần chèn lại vào KhachHang vì bản ghi đã tồn tại
        
        } else {
            // SCENARIO B: TẠO MỚI HOÀN TOÀN

            // 1. CHÈN VÀO BẢNG NGUOIDUNG (Chứa thông tin xác thực Email/MatKhau)
            const insertNguoiDung = `
                INSERT INTO NguoiDung (HovaTendem, Ten, NgaySinh, VaiTro, SoDienThoai, Email, MatKhau)
                OUTPUT INSERTED.ID
                VALUES (@HovaTendem, @Ten, @NgaySinh, @VaiTro, @SoDienThoai, @Email, @MatKhau);
            `;
            
            const requestNguoiDung = new sql.Request(transaction);
            requestNguoiDung.input('HovaTendem', sql.NVarChar(100), hoTenDem);
            requestNguoiDung.input('Ten', sql.NVarChar(100), tenNguoiDung);
            requestNguoiDung.input('NgaySinh', sql.Date, ngaySinhValue);
            requestNguoiDung.input('VaiTro', sql.VarChar(20), DEFAULT_ROLE);
            requestNguoiDung.input('SoDienThoai', sql.VarChar(15), soDienThoaiValue);
            requestNguoiDung.input('Email', sql.VarChar(100), email);
            requestNguoiDung.input('MatKhau', sql.VarChar(255), hashedPassword);
            
            const resultNguoiDung = await requestNguoiDung.query(insertNguoiDung);
            newUserId = resultNguoiDung.recordset[0].ID;


            // 2. CHÈN VÀO BẢNG KHACHHANG (Chứa điểm và hạng thành viên)
            const insertKhachHang = `
                INSERT INTO KhachHang (NguoiDung_ID, DiemTichLuy)
                VALUES (@NguoiDung_ID, @DiemTichLuy); 
            `;

            const requestKhachHang = new sql.Request(transaction);
            requestKhachHang.input('NguoiDung_ID', sql.Int, newUserId);
            requestKhachHang.input('DiemTichLuy', sql.Int, diemTichLuy);
            
            await requestKhachHang.query(insertKhachHang);
        }
        
        // 3. Hoàn tất giao dịch
        await transaction.commit();

        return { success: true, userId: newUserId };

    } catch (dbError) {
        await transaction.rollback();
        
        // Xử lý lỗi trùng email (Email là duy nhất trong bảng NguoiDung)
        if (dbError.message.includes('UQ') || dbError.message.includes('UNIQUE')) {
            throw new Error('Email này đã được sử dụng (Violation of unique constraint).');
        }
        
        console.error('Lỗi giao dịch đăng ký:', dbError);
        throw new Error(dbError.message);
        
    }
};

const getPool = () => {
    if (!appPool) {
        throw new Error('Pool CSDL chưa được khởi tạo! Hãy gọi connectDB() trước.');
    }
    return appPool;
};

// ⭐ EXPORT HÀM ĐÃ SỬA VỚI CÁC THAM SỐ MỚI
module.exports = { connectDB, getPool, registerUser };