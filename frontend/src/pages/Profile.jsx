import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    PESEL: '',
  });

  // Pobierz dane użytkownika po załadowaniu komponentu
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          phone_number: response.data.phone_number,
          PESEL: response.data.PESEL,
        });
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
      }
    };

    fetchUserData();
  }, []);

  // Obsługa zmian w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Zapisz zmienione dane użytkownika
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        'http://localhost:5000/api/users/profile/edit',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Aktualizuj dane użytkownika na podstawie zmian
      setUser((prevUser) => ({
        ...prevUser,
        ...formData,
      }));

      setIsEditing(false);
      alert('Dane zostały zaktualizowane.');
    } catch (error) {
      console.error('Błąd podczas zapisywania danych użytkownika:', error);
      alert('Nie udało się zaktualizować danych.');
    }
  };

  if (!user) {
    return <div>Ładowanie danych użytkownika...</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Twój profil</h1>

      {isEditing ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Imię</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Numer telefonu</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">PESEL</label>
            <input
              type="text"
              name="PESEL"
              value={formData.PESEL}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Zapisz
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Anuluj
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Imię:</strong> {user.first_name}</p>
          <p><strong>Nazwisko:</strong> {user.last_name}</p>
          <p><strong>Numer telefonu:</strong> {user.phone_number}</p>
          <p><strong>PESEL:</strong> {user.PESEL}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edytuj dane
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
