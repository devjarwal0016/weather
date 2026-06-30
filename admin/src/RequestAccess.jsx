import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RequestAccess({ user, token }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.status === 'approved') {
      navigate('/dashboard');
      return;
    }

    if (user.status === 'pending') {
      setMessage('✅ Your request is pending approval. Please wait for an admin to approve your account.');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Request Access</h2>
      
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-gray-700">
          👋 Welcome, <strong>{user.name}</strong>!
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Email: {user.email}
        </p>
        <p className="text-gray-600 text-sm">
          Status: <span className="font-semibold text-yellow-600">{user.status}</span>
        </p>
      </div>

      <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
        <p className="text-yellow-800">{message}</p>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        An admin will review your request shortly.
      </p>
    </div>
  );
}

export default RequestAccess;