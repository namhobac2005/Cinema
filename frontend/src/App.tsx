import { useState } from 'react';
import AuthPage from './feature/AuthPage';
import MainLayout from './feature/MainLayout';
import Dashboard from './feature/Dashboard';
import VouchersPage from './feature/VouchersPage';
import ShowtimesPage from './feature/ShowtimesPage';
import UsersPage from './feature/UsersPage';
import MoviesList from './feature/MovieList';
import ProductsPage from './feature/ProductsPage';
import InvoicesPage from './feature/InvoicesPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
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
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </MainLayout>
  );
}
