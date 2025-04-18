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
        <h1>Welcome to Task Manager🎀</h1>
        <Routes>
          {/* Redirect based on token presence */}
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
            element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;