import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Logout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user');
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      alert('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Logout</h1>
        {user && (
          <div className="mb-6">
            <p className="text-lg text-gray-700">Hello, <span className="font-semibold">{user.name}</span>!</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
