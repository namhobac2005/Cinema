import { useState } from "react";
import AuthPage from "./feature/AuthPage";
import MainLayout from "./feature/MainLayout";
import Dashboard from "./feature/Dashboard";
import VouchersPage from "./feature/VouchersPage";
import ShowtimesPage from "./feature/ShowtimesPage";
import UsersPage from "./feature/UsersPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "movies":
        return (
          <div className="p-6">
            <h1
              className="text-3xl mb-2"
              style={{ color: "#E5E7EB" }}
            >
              Quản lí phim
            </h1>
            <p style={{ color: "#9CA3AF" }}>
              Trang quản lí phim đang được phát triển...
            </p>
          </div>
        );
      case "products":
        return (
          <div className="p-6">
            <h1
              className="text-3xl mb-2"
              style={{ color: "#E5E7EB" }}
            >
              Sản phẩm
            </h1>
            <p style={{ color: "#9CA3AF" }}>
              Trang quản lí sản phẩm đang được phát triển...
            </p>
          </div>
        );
      case "invoices":
        return (
          <div className="p-6">
            <h1
              className="text-3xl mb-2"
              style={{ color: "#E5E7EB" }}
            >
              Hóa đơn
            </h1>
            <p style={{ color: "#9CA3AF" }}>
              Trang quản lí hóa đơn đang được phát triển...
            </p>
          </div>
        );
      case "showtimes":
        return <ShowtimesPage />;
      case "vouchers":
        return <VouchersPage />;
      case "users":
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