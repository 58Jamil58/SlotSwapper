import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();
    fetchMySwappable();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data } = await API.get('/swaps/swappable-slots');
      setSlots(data);
    } catch (err) {
      alert('Failed to fetch slots');
    }
  };

  const fetchMySwappable = async () => {
    try {
      const { data } = await API.get('/events');
      setMySwappable(data.filter(e => e.status === 'SWAPPABLE'));
    } catch (err) {
      alert('Failed to fetch events');
    }
  };

  const handleRequestSwap = async (theirSlotId, mySlotId) => {
    try {
      await API.post('/swaps/swap-request', { mySlotId, theirSlotId });
      alert('Swap request sent');
      setOpen(false);
      fetchSlots();
      fetchMySwappable();
    } catch (err) {
      alert('Failed to request swap');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/logout')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map(slot => (
            <div key={slot._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-2">{slot.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Start: {formatDate(slot.startTime)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                End: {formatDate(slot.endTime)}
              </p>
              <button
                onClick={() => { setSelectedSlot(slot); setOpen(true); }}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Slot to Offer</h2>
              <div className="space-y-2">
                {mySwappable.map(mySlot => (
                  <button
                    key={mySlot._id}
                    onClick={() => handleRequestSwap(selectedSlot._id, mySlot._id)}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {mySlot.title}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 SlotSwapper. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Marketplace;
