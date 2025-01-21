import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserpanelPage from './pages/UserpanelPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Register Route */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Route */}
        <Route path="/users" element={<UserpanelPage />} />
      </Routes>
    </Router>
  );
};

export default App;