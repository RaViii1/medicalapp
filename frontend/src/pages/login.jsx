import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [PESEL, setPESEL] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!PESEL || !password) {
      setError('All fields are required');
      return;
    }

    try {
      // Ensure the URL matches your backend login endpoint
      const response = await axios.post('http://localhost:5000/api/users/login', { PESEL, password });

      // Handle successful login (store token and redirect)
      console.log(response.data);
      setSuccessMessage('Login successful!');
      setError('');

      // Store the JWT token in localStorage (or sessionStorage)
      localStorage.setItem('token', response.data.token);


      // Optionally store additional user information (e.g., user ID, role) if necessary
      // localStorage.setItem('userId', response.data.userId);

      // Redirect to the admin page
      navigate('/admin'); 
    } catch (err) {
      // Check if the error response exists and extract the message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Logowanie nieudane. Sprobuj ponownie.');
      }
      console.error(err);
    }
  };


  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Zaloguj sie</h2>
        
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="PESEL"
            value={PESEL}
            onChange={(e) => setPESEL(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Haslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
              Logowanie
          </button>
        </form>

        {/* Redirect Button to Register Page */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/register')} // Redirect to /register
            className="text-blue-600 hover:underline">
              Nie masz jeszcze konta? Zarejestruj sie
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
