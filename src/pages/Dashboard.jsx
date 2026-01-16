import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Inventory Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || 'User'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="nav-grid">
          
          <Link to="/inventory-checkouts" className="nav-card">
            <h2>👜Inventory Checkouts</h2>
            <p>Manage item checkouts and returns</p>
          </Link>

          
          <Link to="/inventory-items" className="nav-card">
            <h2>📦Inventory Items</h2>
            <p>View and manage inventory stock</p>
          </Link>
          
          <Link to="/purchase-requests" className="nav-card">
            <h2>💸Purchase Requests</h2>
            <p>Track and manage purchase requests</p>
          </Link>
          <Link to="/suppliers" className="nav-card">
            <h2>🏤Suppliers</h2>
            <p>Manage supplier information and contacts</p>
          </Link>
          <Link to="/users" className="nav-card">
            <h2>👤Users</h2>
            <p>Manage user accounts and permissions</p>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
