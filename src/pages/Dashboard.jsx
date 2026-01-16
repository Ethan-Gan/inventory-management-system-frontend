import React from 'react';
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
        {/* <p>Dashboard content coming soon...</p> */}
      </div>
    </div>
  );
};

export default Dashboard;
