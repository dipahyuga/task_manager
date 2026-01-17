import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Dashboard token={token} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;