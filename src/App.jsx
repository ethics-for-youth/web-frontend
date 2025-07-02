import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplicationForm from './pages/ApplicationForm';
import EventDetails from './components/EventDetails';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/application" element={<ApplicationForm />} />
      <Route path="/event-details" element={<EventDetails />} />
    </Routes>
  );
}

