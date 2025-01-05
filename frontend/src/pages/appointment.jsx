import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyAppointments from '../components/MyAppointments'; // Import the new component

const ScheduleAppointment = () => {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [pesel, setPesel] = useState('');
  const [error, setError] = useState('');
  const [viewingAppointments, setViewingAppointments] = useState(false);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/specializations');
        setSpecializations(response.data);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError('Failed to load specializations.');
      }
    };

    fetchSpecializations();
  }, []);

  // Fetch doctors based on selected specialization
  useEffect(() => {
    const fetchDoctors = async () => {
      if (selectedSpecialization) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users?specialization=${selectedSpecialization}`);
          setDoctors(response.data);
        } catch (err) {
          console.error('Error fetching doctors:', err);
          setError('Failed to load doctors.');
        }
      } else {
        // Reset doctors if no specialization is selected
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization]);

  const handleScheduleAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !pesel) {
      setError('Please select a doctor, a date and enter your PESEL.');
      return;
    }

    try {
      // Check if user exists by PESEL
      const userResponse = await axios.get(`http://localhost:5000/api/users/pesel/${pesel}`);
      
      if (!userResponse.data) {
        setError('User with this PESEL does not exist.');
        return;
      }

      // Proceed to schedule the appointment
      await axios.post('http://localhost:5000/api/appointments', {
        doctorId: selectedDoctor,
        date: appointmentDate,
        pesel: pesel,
      });
      
      alert('Appointment scheduled successfully!');
      // Reset the form
      setSelectedDoctor('');
      setAppointmentDate('');
      setPesel('');
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError('Failed to schedule appointment.');
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Umów Wizytę</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex mb-4">
        <button 
          onClick={() => setViewingAppointments(false)} 
          className={`px-4 py-2 rounded ${!viewingAppointments ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Umówienie wizyty
        </button>
        <button 
          onClick={() => setViewingAppointments(true)} 
          className={`px-4 py-2 rounded ${viewingAppointments ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Moje Wizyty
        </button>
      </div>

      {viewingAppointments ? (
        <MyAppointments pesel={pesel} /> // Pass pesel to MyAppointments component
      ) : (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Wybierz Specjalizację:</label>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          >
            <option value="">-- Wybierz specjalizację --</option>
            {specializations.map(spec => (
              <option key={spec._id} value={spec.name}>{spec.name}</option>
            ))}
          </select>

          <label className="block mb-2 font-semibold">Wybierz Lekarza:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            disabled={!selectedSpecialization}
          >
            <option value="">-- Wybierz lekarza --</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>{doctor.first_name} {doctor.last_name}</option>
            ))}
          </select>

          <label className="block mb-2 font-semibold">Wybierz Datę:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={today} // Set minimum date to today
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />

          <label className="block mb-2 font-semibold">Wprowadź PESEL:</label>
          <input
            type="text"
            value={pesel}
            onChange={(e) => setPesel(e.target.value)}
            placeholder="PESEL"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          
          <button 
            onClick={handleScheduleAppointment} 
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-200"
          >
            Umów Wizytę
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointment;
