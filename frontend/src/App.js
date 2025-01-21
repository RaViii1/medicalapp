import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import Register from './pages/register'; // Import your Register component
import Login from './pages/login'; // Import your Login component
import LandingPage from './landingPage'; // Import your LandingPage component
import Navbar from './components/navbar';
import ScheduleAppointment from './pages/appointment';
import Profile from './pages/Profile';
const App = () => {
  return (
    <Router>
       <Navbar />
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<ScheduleAppointment />} 
          /> 
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
