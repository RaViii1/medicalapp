import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [PESEL, setPESEL] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !PESEL || !password || !phoneNumber) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        first_name: firstName,
        last_name: lastName,
        PESEL,
        password,
        phone_number: phoneNumber,
      });
      
      // Set success message and clear input fields
      setSuccessMessage('Registration successful! Please log in.');
      setFirstName('');
      setLastName('');
      setPESEL('');
      setPassword('');
      setPhoneNumber('');
      setError('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page
      }, 2000); // Adjust the delay as needed

    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="PESEL"
            value={PESEL}
            onChange={(e) => setPESEL(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>

     
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/login')} // Redirect to /login
            className="text-blue-600 hover:underline">
              Already have an account? Login here.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
