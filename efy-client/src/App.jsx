import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home/LandingPage';
import RegisterPage from './pages/Home/RegisterPage';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/application" element={<ApplicationForm />} />
      <Route path="/event-details" element={<EventDetails />} />
    </Routes>
  );
}

