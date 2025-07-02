import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ApplicationForm from './pages/ApplicationForm';
import EventDetails from './components/EventDetails';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/application" element={<ApplicationForm />} />
      <Route path="/event-details" element={<EventDetails />} />
      
      
    </Routes>
  );
}

export default App;
