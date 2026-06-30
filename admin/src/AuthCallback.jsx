import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback({ setUser, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setToken(token);

        if (user.status === 'pending') {
          navigate('/');
        } else if (user.status === 'approved') {
          navigate('/dashboard');
        } else {
          navigate('/login?error=unknown_status');
        }
      } catch (err) {
        console.log('Auth callback error:', err);
        navigate('/login?error=callback_failed');
      }
    } else {
      navigate('/login?error=missing_params');
    }
  }, [location, navigate, setUser, setToken]);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Completing Login...</h2>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Please wait while we log you in</p>
    </div>
  );
}

export default AuthCallback;