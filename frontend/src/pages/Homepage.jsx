import React from 'react';
import MainLayout from '../components/MainLayout.jsx';
import { Typography, Grid, Paper } from '@mui/material'; // Thư viện để làm nội dung

// Đây là nội dung thực tế của trang tổng quan
function DashboardContent() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      <Typography paragraph>
        Chào mừng trở lại! Đây là tổng quan hoạt động của rạp.
      </Typography>

      {/* Bạn sẽ đặt các Card, Biểu đồ ở đây */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, backgroundColor: 'white' }}>
            <Typography variant="h6">Doanh thu hôm nay</Typography>
            <Typography variant="h4" color="primary">
              ...Loading...
              {/* (Dữ liệu từ API /dashboard sẽ vào đây) */}
            </Typography>
          </Paper>
        </Grid>
        {/* ... Các card khác ... */}
      </Grid>
    </>
  );
}

// 2. Component Homepage
export default function Homepage() {
  return (
    // 3. "BỌC" NỘI DUNG BẰNG LAYOUT
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}
