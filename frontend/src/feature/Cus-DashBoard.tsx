import React, { useState, useEffect } from 'react';
import {
  Construction,
  Rocket,
  ArrowLeft,
  Hammer,
  Timer,
  Sparkles,
  Bell,
  LogOut,
  Film,
  ChevronRight,
} from 'lucide-react';

// --- STYLES (CSS IN JS) ---
// Sử dụng style object để đảm bảo giao diện KHÔNG BAO GIỜ bị vỡ dù không có Tailwind
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0B0F19',
    color: '#E2E8F0',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const, // Cast to specific type for flex direction
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  backgroundOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, #1a2035 0%, #0B0F19 100%)',
    zIndex: 0,
  },
  card: {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: 'rgba(21, 27, 43, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '60px 40px',
    textAlign: 'center' as const,
  },
  headerBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #7c3aed, #3b82f6, #7c3aed)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '99px',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    border: '1px solid rgba(124, 58, 237, 0.2)',
    color: '#d8b4fe',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '32px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    color: 'white',
    marginBottom: '16px',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    maxWidth: '600px',
    margin: '0 auto 40px',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Ép buộc 3 cột
    gap: '24px',
    width: '100%',
    marginBottom: '48px',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    color: '#d8b4fe',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '20px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: 'white',
    color: '#0F172A',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    backgroundColor: 'transparent',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

// --- COMPONENTS ---

const FeatureItem = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div style={styles.featureCard}>
    <div style={styles.iconCircle}>
      <Icon size={32} />
    </div>
    <h3
      style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
        color: 'white',
      }}
    >
      {title}
    </h3>
    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
      {desc}
    </p>
  </div>
);

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Responsive logic thủ công (nếu cần thiết cho mobile)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setProgress(75), 500);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check ngay lập tức
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Điều chỉnh style grid động dựa trên kích thước màn hình
  const currentGridStyle = {
    ...styles.grid,
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundOverlay} />

      {/* MAIN CONTENT */}
      <div
        style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease-out',
        }}
      >
        <div style={styles.headerBar} />

        {/* Badge */}
        <div style={styles.badge}>
          <Construction size={16} />
          <span>Hệ thống đang bảo trì & nâng cấp</span>
        </div>

        {/* Typography */}
        <h1 style={styles.title}>
          Giao diện quản lý <br />
          <span style={{ color: '#a78bfa' }}>Phiên bản 2.0</span>
        </h1>
        <p style={styles.subtitle}>
          Chúng tôi đang xây dựng lại toàn bộ hệ thống Dashboard để mang lại
          hiệu suất vượt trội và trải nghiệm người dùng tốt nhất.
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#94a3b8',
            }}
          >
            <span>Tiến độ hoàn thành</span>
            <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>75%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
                borderRadius: '10px',
                transition: 'width 1.5s ease-out',
              }}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div style={currentGridStyle}>
          <FeatureItem
            icon={Timer}
            title="Lịch sử & Thống kê"
            desc="Xem lại lịch sử đặt vé và biểu đồ doanh thu chi tiết."
          />
          <FeatureItem
            icon={Sparkles}
            title="Ưu đãi độc quyền"
            desc="Quản lý kho voucher và các chương trình khuyến mãi."
          />
          <FeatureItem
            icon={Bell}
            title="Thông báo hệ thống"
            desc="Cập nhật tin tức phim mới và thông báo bảo trì."
          />
        </div>

        {/* Buttons */}
        {/* <div style={styles.buttonGroup}>
          <button
            onClick={() => window.history.back()}
            style={styles.primaryButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ArrowLeft size={20} />
            More Infỏ
          </button> */}

        <button
          onClick={onLogout}
          style={styles.secondaryButton}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
        {/* </div> */}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#64748b',
          fontSize: '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        <Hammer size={14} />
        <span>Dev Team © 2025</span>
      </div>
    </div>
  );
}
