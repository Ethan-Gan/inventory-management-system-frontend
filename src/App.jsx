import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Suppliers from './pages/Suppliers'
import InventoryItems from './pages/InventoryItems'
import PurchaseRequests from './pages/PurchaseRequests'
import InventoryCheckouts from './pages/InventoryCheckouts'

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

        {/* Table Pages - All Protected */}
        <Route 
          path="/users" 
          element={user ? <Users /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/suppliers" 
          element={user ? <Suppliers /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/inventory-items" 
          element={user ? <InventoryItems /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/purchase-requests" 
          element={user ? <PurchaseRequests /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/inventory-checkouts" 
          element={user ? <InventoryCheckouts /> : <Navigate to="/login" />} 
        />

        {/* DEFAULT: Send everyone to /login first */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
