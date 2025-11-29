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
import CustomerBooking from './feature/Cus-DashBoard';
import GuestDashboard from './feature/Guest-Dashboard';

import { getCurrentUser, logout, User } from './api/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  //Tránh nháy màn hình khi load
  const [isLoading, setIsLoading] = useState(true);

  //Chuyển login/register
  const [isRegistering, setIsRegistering] = useState(false);

  //Chạy 1 lần khi App tải
  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrentUser(user);
    setIsLoading(false);
  }, []);

  //Hàm được gọi khi Login thành công
  const handleLogin = () => {
    const user = getCurrentUser();
    if (user) setCurrentUser(user);
    setIsRegistering(false);
  };

  //Logout
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setIsRegistering(false);
  };

  //⏳ Loading
  if (isLoading) {
    return <div>Đang tải ứng dụng...</div>;
  }

  //📌 Guest mode + chưa đăng nhập
  if (!currentUser) {
    //Nếu click Continue as Guest => chuyển sang GuestDashboard
    if (currentPage === 'guestdashboard') {
      return <GuestDashboard onBackToLogin={handleLogout} />;
    }

    //Ngược lại vẫn ở login/register form
    return (
      <AuthPage
        onLogin={handleLogin}
        onGuestContinue={() => {
          console.log('GOTO GUEST MODE');
          logout();
          setCurrentUser(null);
          setIsRegistering(false);
          setCurrentPage('guestdashboard');
        }}
        isRegistering={isRegistering}
        onToggleRegister={() => setIsRegistering((prev) => !prev)}
      />
    );
  }

  //📌 Manager
  if (currentUser.vaiTro === 'QuanLy') {
    const ManagerPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'guestdashboard':
          return <GuestDashboard />;
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

  //📌 Customer & Employee share same page
  if (currentUser.vaiTro === 'KhachHang' || currentUser.vaiTro === 'NhanVien') {
    return <CustomerBooking onLogout={handleLogout} />;
  }

  if (!currentUser && currentPage === 'guestdashboard') {
    return <GuestDashboard onBackToLogin={() => setCurrentPage('dashboard')} />;
  }


  //Debug khi token kh xóa
  console.log('User Role hien tai:', currentUser.vaiTro); // Debug xem role là gì

  return (
    <div style={{ padding: 20, textAlign: 'center', color: 'white' }}>
      <h1>Lỗi phân quyền</h1>
      <p>
        Xin chào <strong>{currentUser.Name || currentUser.username}</strong>
      </p>
      <p>
        Vai trò hiện tại của bạn là:{' '}
        <strong>{currentUser.Role || 'Chưa xác định'}</strong>
      </p>
      <p>Hệ thống không tìm thấy giao diện phù hợp cho vai trò này.</p>
      <button
        onClick={handleLogout}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
