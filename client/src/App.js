// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  return (
    <Router>
      <div className="App">
        <h1>Welcome to Task Manager</h1>
        <Routes>
          {/* If no token, redirect to login */}
          <Route
            path="/"
            element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
