import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import RequestAccess from './RequestAccess';
import AdminDashboard from './AdminDashboard';
import AuthCallback from './AuthCallback';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">WeatherGuard</h1>
            <div>
              {user ? (
                <>
                  <span className="mr-4">
                    👋 {user.name} 
                    <span className="text-xs ml-2 text-gray-500">
                      ({user.status})
                    </span>
                  </span>
                  <button onClick={logout} className="text-red-500 hover:text-red-700">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-blue-500">Login</Link>
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<RequestAccess user={user} token={token} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback setUser={setUser} setToken={setToken} />} />
            <Route path="/dashboard" element={<AdminDashboard user={user} token={token} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;