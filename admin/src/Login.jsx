import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to WeatherGuard</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
        >
          <span className="mr-2">🔵</span>
          Login with Google
        </button>
        
        <button
          onClick={handleGithubLogin}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 flex items-center justify-center"
        >
          <span className="mr-2">🐙</span>
          Login with GitHub
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Don't have access? <Link to="/" className="text-blue-500">Request Access</Link></p>
        <p className="mt-2 text-xs text-gray-400">You'll need admin approval after login</p>
      </div>
    </div>
  );
}

export default Login;