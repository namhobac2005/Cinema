import * as React from 'react';
// 1. Import 'Link' từ React Router
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CssBaseline,
} from '@mui/material';

// 2. Import các icon bạn cần
import DashboardIcon from '@mui/icons-material/Dashboard';
import MovieIcon from '@mui/icons-material/Movie';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 280; // Độ rộng của menu

// 3. Định nghĩa các mục menu và đường dẫn (path) của chúng
const mainMenuItems = [
  { text: 'Tổng quan', icon: <DashboardIcon />, path: '/' },
  { text: 'Quản lí phim', icon: <MovieIcon />, path: '/phim' },
  { text: 'Sản phẩm', icon: <FastfoodIcon />, path: '/san-pham' },
  { text: 'Hóa đơn', icon: <ReceiptIcon />, path: '/hoa-don' },
  { text: 'Phát hành voucher', icon: <LocalOfferIcon />, path: '/voucher' },
  { text: 'Suất chiếu', icon: <SlideshowIcon />, path: '/suat-chieu' },
];

const secondaryMenuItems = [
  { text: 'Đăng xuất', icon: <LogoutIcon />, path: '/login' }, // Giả sử /login cũng là trang logout
];

// --- Bắt đầu component ---
// Nó nhận 'children' (nội dung trang) làm prop
export default function MainLayout({ children }) {
  // 4. Dùng 'useLocation' để biết bạn đang ở trang nào
  const location = useLocation();
  const currentPath = location.pathname;

  // --- NỘI DUNG CỦA MENU (Sidebar) ---
  const drawerContent = (
    <Box
      sx={{
        backgroundColor: '#161C24',
        color: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box sx={{ padding: '24px 20px', display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/1183/1183671.png"
          sx={{ width: 40, height: 40, marginRight: 1.5 }}
        />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          CinemaHub
        </Typography>
      </Box>

      {/* Menu chính */}
      <List sx={{ flexGrow: 1 }}>
        {mainMenuItems.map((item) => {
          // 5. Kiểm tra xem mục này có đang "active" không
          const isActive = currentPath === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ padding: '0 12px' }}>
              {/* 6. Biến ListItemButton thành Link React Router */}
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  borderRadius: '8px',
                  // 7. Style nếu 'isActive'
                  ...(isActive && {
                    backgroundColor: 'rgba(0, 171, 237, 0.16)',
                    '&:hover': { backgroundColor: 'rgba(0, 171, 237, 0.26)' },
                  }),
                  ...(!isActive && {
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#00ABED' : '#919EAB',
                    minWidth: 'auto',
                    marginRight: '16px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      color: isActive ? '#00ABED' : '#FFFFFF',
                      fontWeight: isActive ? 'bold' : 'normal',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Menu Đăng xuất */}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ padding: '0 12px' }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              <ListItemIcon
                sx={{ color: '#919EAB', minWidth: 'auto', marginRight: '16px' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ sx: { color: '#FFFFFF' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // --- CẤU TRÚC LAYOUT (Menu + Nội dung trang) ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* MENU BÊN TRÁI (cố định) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* NỘI DUNG CHÍNH */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#0F131A',
          minHeight: '100vh',
          padding: 3,
          color: 'white',
        }}
      >
        {/* Đây là nội dung trang (Homepage, PhimPage) */}
        {children}
      </Box>
    </Box>
  );
}
