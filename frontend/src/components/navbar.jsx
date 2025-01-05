import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">

        <Link to="/" className="text-white text-2xl font-bold">Aplikacja medyczna</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Home</Link>
          <Link to="/admin" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Admin</Link>
          <Link to="/schedule" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Appointment </Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
