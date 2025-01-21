import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Hook do nawigacji, aby przekierować użytkownika po wylogowaniu

  // Funkcja wylogowująca
  const handleLogout = () => {
    localStorage.removeItem('token'); // Usuwamy token z localStorage
    navigate('/'); // Przekierowujemy użytkownika na stronę główną
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Aplikacja medyczna</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Strona główna</Link>

          {/* Linki dostępne tylko po zalogowaniu (z tokenem) */}
          {token && (
            <>
              <Link to="/admin" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Admin</Link>
              <Link to="/schedule" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Wizyta</Link>
              <Link to="/profile" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Profil</Link>

              {/* Przycisk wylogowywania */}
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded"
              >
                Wyloguj się
              </button>
            </>
          )}

          {/* Link do logowania, jeśli nie ma tokena */}
          {!token && (
            <Link to="/login" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Zaloguj się</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
