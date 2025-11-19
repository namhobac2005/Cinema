import { useState, useEffect } from 'react';
import AuthPage from './feature/AuthPage';
import MainLayout from './feature/MainLayout';
import Dashboard from './feature/Dashboard';
import VouchersPage from './feature/VouchersPage';
import ShowtimesPage from './feature/ShowtimesPage';
import UsersPage from './feature/UsersPage';
import MoviesList from './feature/MovieList';
import ProductsPage from './feature/ProductsPage';
import InvoicesPage from './feature/InvoicesPage';
import CusDashboard from './feature/Cus-DashBoard';

import { getCurrentUser, logout, User } from './api/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  //Thêm state loading để tránh "nháy" màn hình login khi F5
  const [isLoading, setIsLoading] = useState(true);

  // HÊM STATE ĐỂ QUẢN LÝ VIỆC CHUYỂN ĐỔI GIỮA LOGIN VÀ REGISTER
  const [isRegistering, setIsRegistering] = useState(false);

  //Chạy 1 lần khi App tải
  useEffect(() => {
    // Lấy user từ localStorage
    const user = getCurrentUser();
    if (user) {
      // Nếu có, tự động đăng nhập
      setCurrentUser(user);
    }
    // Đã kiểm tra xong, cho phép hiển thị
    setIsLoading(false);
  }, []); //chỉ chạy 1 lần

  // Hàm này được AuthPage gọi sau khi API login thành công
  const handleLogin = () => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsRegistering(false);
  };

  // Hàm này được MainLayout gọi
  const handleLogout = () => {
    logout(); // Xóa token/user khỏi localStorage
    setCurrentUser(null); // Set state về chưa đăng nhập
    setCurrentPage('dashboard');
    setIsRegistering(false);
  };

  // Nếu đang kiểm tra token, chưa hiển thị gì cả
  if (isLoading) {
    return <div>Đang tải ứng dụng...</div>; // (Hoặc spinner)
  }
  // Kiểm tra state mới
  if (!currentUser) {
    return (
        <AuthPage 
            onLogin={handleLogin} 
            // ⭐ TRUYỀN PROPS ĐIỀU KHIỂN XUỐNG AUTH PAGE
            isRegistering={isRegistering}
            onToggleRegister={() => {
                // Đảo ngược trạng thái khi người dùng nhấn nút chuyển đổi
                setIsRegistering(prev => !prev);
            }}
        />
    );
}

  // là Manager
  if (currentUser.vaiTro === 'QuanLy') {
    const ManagerPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'movies':
          return <MoviesList />;
        case 'products':
          return <ProductsPage />;
        case 'invoices':
          return <InvoicesPage />;
        case 'showtimes':
          return <ShowtimesPage />;
        case 'vouchers':
          return <VouchersPage />;
        case 'users':
          return <UsersPage />;
        default:
          return <Dashboard />;
      }
    };
    return (
      <MainLayout
        user={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      >
        {ManagerPage()}
      </MainLayout>
    );
  }

  // là khách
  if (currentUser.vaiTro === 'KhachHang') {
    return <CusDashboard onLogout={handleLogout} />;
  }

  // Nhân viên
  if (currentUser.vaiTro === 'NhanVien') {
    return <CusDashboard onLogout={handleLogout} />;
  }
}
