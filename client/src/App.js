import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <span>&#9745;</span> Task Manager
          </Link>
          <div className="navbar-actions">
            {token ? (
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/register" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="page-container">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={token ? "/dashboard" : "/login"} />}
            />
            <Route
              path="/login"
              element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
