import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingSpecializationId, setEditingSpecializationId] = useState(null);
  const [users, setUsers] = useState([]); // State for users
  const [error, setError] = useState('');

  // Fetch specializations and users from the database on component mount
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); 
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };

    fetchSpecializations();
    fetchUsers();
  }, []);

  const addSpecialization = async () => {
    if (newSpecialization.trim() === '' || newDescription.trim() === '') {
      setError('Nazwa i opis specjalizacji nie mogą być puste');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/specializations', { 
        name: newSpecialization,
        description: newDescription 
      });
      setSpecializations([...specializations, response.data]);
      setNewSpecialization('');
      setNewDescription('');
      setError('');
    } catch (err) {
      console.error('Error adding specialization:', err);
      setError('Failed to add specialization.');
    }
  };

  const removeSpecialization = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/specializations/${id}`);
      const updatedSpecializations = specializations.filter(spec => spec._id !== id);
      setSpecializations(updatedSpecializations);
    } catch (err) {
      console.error('Error removing specialization:', err);
      setError('Failed to remove specialization.');
    }
  };

  // Function to update user role and specialization
  const updateUserRoleAndSpecialization = async (userId, newRoleName, specializationName) => {
    try {
        // Fetch the role's ObjectId based on its name
        const roleResponse = await axios.get(`http://localhost:5000/api/roles/${newRoleName}`);
        
        if (!roleResponse.data || !roleResponse.data._id) {
            throw new Error('Role not found');
        }

        const newRoleId = roleResponse.data._id; // Get the ObjectId of the role

        // Set specialization to null if the new role is user or admin
        const updatedData = { 
            role: newRoleId,
            specialization: (newRoleName === 'user' || newRoleName === 'admin') ? null : specializationName
        };

        // Update user with new role and specialization
        const response = await axios.put(`http://localhost:5000/api/users/${userId}`, updatedData);
        
        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }

        // Update local state to reflect the change
        setUsers(users.map(user => 
            user._id === userId ? { ...user, role: { _id: newRoleId, name: newRoleName }, specialization: updatedData.specialization } : user
        ));
        
        alert(`Rola użytkownika ${userId} została zaktualizowana do ${newRoleName} z specjalizacją ${updatedData.specialization || 'Brak'}`);
    } catch (err) {
        console.error('Error updating user role:', err);
        
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message); // Display specific error message from backend
        } else {
            setError('Failed to update user role.');
        }
    }
};


  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  // Function to start editing a specialization
  const startEditingSpecialization = (spec) => {
    setNewSpecialization(spec.name);
    setNewDescription(spec.description);
    setEditingSpecializationId(spec._id);
  };

  // Function to update a specialization
  const updateSpecialization = async () => {
    if (!editingSpecializationId || newSpecialization.trim() === '' || newDescription.trim() === '') {
      setError('Nazwa i opis specjalizacji nie mogą być puste');
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/specializations/${editingSpecializationId}`, { 
        name: newSpecialization,
        description: newDescription 
      });
      
      // Update local state
      const updatedSpecs = specializations.map(spec =>
        spec._id === editingSpecializationId ? { ...spec, name: newSpecialization, description: newDescription } : spec
      );
      
      setSpecializations(updatedSpecs);
      
      // Reset form and editing state
      setNewSpecialization('');
      setNewDescription('');
      setEditingSpecializationId(null);
      
    } catch (err) {
       console.error('Error updating specialization:', err);
       setError('Failed to update specialization.');
     }
   };

   return (
     <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
       <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Admin Panel</h2>

       {/* Display error message if any */}
       {error && <p className="text-red-500 mb-4">{error}</p>}

       {/* Specializations Section */}
       <div className="mb-6">
         <h3 className="text-3xl font-semibold mb-2">Lista Specjalizacji:</h3>
         <ul className="mb-4 w-full bg-white rounded-lg shadow-md">
           {specializations.map((spec) => (
             <li key={spec._id} className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
               <span className="font-medium">{spec.name} - {spec.description}</span>
               <div className="flex items-center">
                 <button 
                   onClick={() => startEditingSpecialization(spec)} 
                   className="ml-4 text-white bg-yellow-600 rounded px-4 py-1 hover:bg-yellow-700 transition duration-200"
                 >
                   Edytuj
                 </button>
                 <button 
                   onClick={() => removeSpecialization(spec._id)} 
                   className="ml-4 text-white bg-red-600 rounded px-4 py-1 hover:bg-red-700 transition duration-200"
                 >
                   Usuń
                 </button>
               </div>
             </li>
           ))}
         </ul>

         {/* Form for adding or updating a specialization */}
         <div className="flex mb-4">
           <input
             type="text"
             value={newSpecialization}
             onChange={(e) => setNewSpecialization(e.target.value)}
             placeholder="Dodaj nową specjalizację"
             className="border border-gray-300 rounded p-2 flex-grow mr-2"
           />
           <input
             type="text"
             value={newDescription}
             onChange={(e) => setNewDescription(e.target.value)}
             placeholder="Opis specjalizacji"
             className="border border-gray-300 rounded p-2 flex-grow mr-2"
           />
           <button 
             onClick={editingSpecializationId ? updateSpecialization : addSpecialization} 
             className={`bg-blue-${editingSpecializationId ? '600' : '500'} text-white rounded px-4 py-2 hover:bg-blue-${editingSpecializationId ? '700' : '600'} transition duration-200`}
           >
             {editingSpecializationId ? 'Zaktualizuj' : 'Dodaj'}
           </button>
         </div>
       </div>

       {/* Users Section */}
       <div>
         <h3 className="text-3xl font-semibold mb-2">Zarządzanie Użytkownikami:</h3>
         <ul className="mb-4 w-full bg-white rounded-lg shadow-md">
           {users.map((user) => (
             <li key={user._id} className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
               <span className="font-medium">{user.first_name} {user.last_name} - {user.role.name}</span>
               
               {user.role.name === 'doctor' && (
                 <>
                   {/* Show specialization next to doctor */}
                   <span className="ml-4 text-gray-600">Specjalizacja: {user.specialization || 'Brak'}</span>
                   {/* Specialization picker */}
                   <select 
                     onChange={(e) => updateUserRoleAndSpecialization(user._id, user.role.name, e.target.value)} // Handle selection change here
                     className="ml-4 border border-gray-300 rounded p-1"
                   >
                     <option value="">Wybierz specjalizację</option>
                     {specializations.map(spec => (
                       <option key={spec._id} value={spec.name}>{spec.name}</option>
                     ))}
                   </select>
                 </>
               )}

               {/* Dropdown for changing user role */}
               <select 
                 value={user.role.name} 
                 onChange={(e) => updateUserRoleAndSpecialization(user._id, e.target.value, user.specialization)}
                 className="ml-4 border border-gray-300 rounded p-1"
               >
                 <option value="">Zmień rolę</option>
                 <option value="admin">Admin</option>
                 <option value="user">Użytkownik</option>
                 <option value="doctor">Lekarz</option>
               </select>

             

               <button 
                 onClick={() => deleteUser(user._id)} 
                 className="ml-auto text-white bg-red-600 rounded px-4 py-1 hover:bg-red-700 transition duration-200"
               >
                 Usuń Użytkownika
               </button>
             </li>
           ))}
         </ul>

         
       </div>
     </div>
     
   );
};

export default Admin;
