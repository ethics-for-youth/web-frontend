import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplicationForm from './pages/ApplicationForm';
import EventDetails from './components/EventDetails';
import Success from './components/Success';
import HeroSection1 from './components/HeroSection1';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/application" element={<ApplicationForm />} />
      <Route path="/event-details" element={<EventDetails />} />
      <Route path="/success" element={<Success />} />
      <Route path="/hero" element={<HeroSection1 />} />
    </Routes>
  );
}

