import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Notifications = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Assuming endpoints for incoming/outgoing requests
      const { data: inc } = await API.get('/swaps/incoming-requests');
      const { data: out } = await API.get('/swaps/outgoing-requests');
      setIncoming(inc);
      setOutgoing(out);
    } catch (err) {
      alert('Failed to fetch requests');
    }
  };

  const handleResponse = async (requestId, accepted) => {
    try {
      await API.post(`/swaps/swap-response/${requestId}`, { accepted });
      alert(accepted ? 'Swap accepted' : 'Swap rejected');
      fetchRequests();
    } catch (err) {
      alert('Failed to respond');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
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
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Incoming Requests</h2>
          <div className="space-y-4">
            {incoming.map(req => (
              <div key={req._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Swap for {req.requestedSlotId.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Offered: {req.offeredSlotId.title}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleResponse(req._id, true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(req._id, false)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Outgoing Requests</h2>
          <div className="space-y-4">
            {outgoing.map(req => (
              <div key={req._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Requested: {req.requestedSlotId.title}</h3>
                <p className="text-sm text-gray-600">Offered: {req.offeredSlotId.title} - {req.status}</p>
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

export default Notifications;
