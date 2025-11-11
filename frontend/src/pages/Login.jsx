import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const data = await login({ username: email, password: password });
      //localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. BOX CHA CĂN GIỮA (Giữ nguyên)
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      {/* 2. BOX CARD (Thay thế Box form cũ) */}
      <Box
        sx={{
          maxWidth: 600, // Đặt chiều rộng tối đa cho card
          width: '100%',
          display: 'flex',
          boxShadow: '0 8px 24px -12px rgba(0,0,0,0.2)',
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6} sx={{ alignSelf: 'stretch' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: { xs: 'none', md: 'block' },
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 4, // Thêm padding cho nội dung form
                backgroundColor: 'white',
                height: '100%', // Giúp form cao bằng ảnh
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Đăng nhập
              </Typography>

              <TextField
                label="Email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {error}
                </Alert>
              )}
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                sx={{ mt: 3, mb: 2, p: 1.5, fontSize: '1rem', borderRadius: 5 }}
              >
                Đăng nhập
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
