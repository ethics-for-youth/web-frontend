
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home/LandingPage';
import RegisterPage from './pages/Home/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

