import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  // 1. Initialize auth state from LocalStorage (persists on refresh)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      <Routes>
        {/* If NOT logged in, show Login. If already logged in, skip to Dashboard */}
        <Route 
          path="/login" 
          element={!user ? <Login setAuth={setUser} /> : <Navigate to="/dashboard" />} 
        />

        {/* PROTECTED ROUTE: If NOT logged in, redirect to login */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* DEFAULT: Send everyone to /login first */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App