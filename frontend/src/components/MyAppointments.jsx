import React, { useState } from 'react';
import axios from 'axios';

const MyAppointments = () => {
  const [pesel, setPesel] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Zakładając, że token jest przechowywany w localStorage

  const fetchAppointments = async () => {
    if (pesel) {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/appointments/${pesel}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Dodanie tokena do nagłówka
          }
        });
        console.log('Fetched appointments:', response.data); // Logowanie danych
        setAppointments(response.data);
      } catch (err) {
        console.error('Błąd podczas pobierania wizyt:', err);
        setError('Nie udało się załadować wizyt.');
      }
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold mb-4 text-center text-blue-600">Moje Wizyty</h3>
      
      {/* Input do wprowadzenia PESEL */}
      <label className="block mb-2 font-semibold">Wprowadź swój PESEL:</label>
      <input
        type="text"
        value={pesel}
        onChange={(e) => setPesel(e.target.value)}
        placeholder="PESEL"
        className="border border-gray-300 rounded p-2 mb-4 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <button 
        onClick={fetchAppointments} 
        className="w-auto bg-blue-600 ml-8 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-200"
      >
        Pokaż Wizyty
      </button>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      <ul className="space-y-2 mt-4">
        {appointments.length === 0 ? (
          <li className="text-gray-500 text-center">Brak zaplanowanych wizyt.</li>
        ) : (
          appointments.map(appointment => (
            <li key={appointment._id} className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition duration-200">
              <div className="font-medium">
                Data wizyty: {new Date(appointment.date).toLocaleString()}
              </div>
              <div className="text-gray-700">
                Lekarz: {appointment.doctorFirstName} {appointment.doctorLastName} {/* Wyświetlanie imienia i nazwiska lekarza */}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MyAppointments;
