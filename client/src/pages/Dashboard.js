import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get('/events');
      setEvents(data);
    } catch (err) {
      alert('Failed to fetch events');
    }
  };

  const handleCreateEvent = async () => {
    try {
      await API.post('/events', newEvent);
      fetchEvents();
      setNewEvent({ title: '', startTime: '', endTime: '' });
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleToggleSwappable = async (id, status) => {
    try {
      await API.put(`/events/${id}`, { status: status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE' });
      fetchEvents();
    } catch (err) {
      alert('Failed to update event');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Marketplace
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Notifications
          </button>
          <button
            onClick={() => navigate('/logout')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreateEvent}
            className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-medium text-gray-800 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Start: {formatDate(event.startTime)}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  End: {formatDate(event.endTime)}
                </p>
                <p className="text-sm text-gray-500 mb-4">Status: {event.status}</p>
                <button
                  onClick={() => handleToggleSwappable(event._id, event.status)}
                  className={`font-bold py-2 px-4 rounded ${
                    event.status === 'SWAPPABLE'
                      ? 'bg-red-500 hover:bg-red-700 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 SlotSwapper. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
