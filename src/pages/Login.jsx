import React, { useState } from 'react';
import './Login.css';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.user); // Tells App.jsx we are logged in
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Server is waking up... try again in 30 seconds.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="black-header">Inventory Login</div>
      
      <div className="login-content">
        <h1>Ethan Gan's<br/>Inventory System</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <p className="error-msg">{error && `! ${error}`}</p>

          <button type="submit" className="enter-btn">
            {loading ? 'LOADING...' : 'ENTER'}
          </button>
        </form>

        <div className="demo-info">
          // for demo use:<br/>
          username: <span className="demo-credentials">guest</span><br/>
          password: <span className="demo-credentials">happyhome123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
