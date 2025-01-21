import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/appointments/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas pobierania wizyt:', error);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Ładowanie wizyt...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Twoje Wizyty</h2>
      
      {appointments.length === 0 ? (
        <p className="text-center text-lg">Brak wizyt.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-lg">PESEL:</p>
                  <p className="text-gray-600">{appointment.pesel}</p>
                </div>
                <div>
                  <p className="font-medium text-lg">Data:</p>
                  <p className="text-gray-600">{new Date(appointment.date).toLocaleString()}</p>
                </div>
              </div>
 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
