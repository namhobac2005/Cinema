// export default App
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Homepage from './pages/Homepage.jsx';
import CssBaseline from '@mui/material/CssBaseline';
export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}
