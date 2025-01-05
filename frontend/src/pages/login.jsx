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
      const response = await axios.post('http://localhost:5000/api/login', { PESEL, password });
      // Handle successful login (e.g., store token or redirect)
      console.log(response.data);
      setSuccessMessage('Login successful!');
      setError('');
      navigate('/admin'); // Redirect to /admin
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
              Login
          </button>
        </form>

        {/* Redirect Button to Register Page */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/register')} // Redirect to /register
            className="text-blue-600 hover:underline">
              Don't have an account? Register here.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
