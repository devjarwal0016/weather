import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ user, token }) {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/users/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      setPendingUsers(data);
      setLoading(false);
    } catch (err) {
      console.log('Failed to fetch users:', err);
      setLoading(false);
    }
  }, [token]); // token is a dependency

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',').map(email => email.trim());
    
    // Check if user is admin
    if (!adminEmails.includes(user.email)) {
      alert('You are not an admin!');
      navigate('/');
      return;
    }

    setIsAdmin(true);
    fetchPendingUsers();
  }, [user, token, navigate, fetchPendingUsers]); 

  const approveUser = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/users/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        fetchPendingUsers();
        alert('User approved! 🎉');
      } else {
        alert('Failed to approve user');
      }
    } catch (err) {
      console.log('Approval error:', err);
      alert('Error approving user');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Approvals ({pendingUsers.length})</h2>
        
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending users</p>
        ) : (
          <ul className="divide-y">
            {pendingUsers.map((user) => (
              <li key={user._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {user.name || 'No name'}
                    <span className="text-xs ml-2 text-gray-400">
                      ({user.provider || 'unknown'})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => approveUser(user._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-6 bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-2">🔔 Manual Weather Alert</h3>
        <button 
          onClick={async () => {
            try {
              await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/weather/trigger`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              alert('Weather alert sent to all approved users!');
            } catch (err) {
              alert('Failed to send alert');
            }
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Send Test Alert
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;