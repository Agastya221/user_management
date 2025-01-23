import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './middleware/MiddlewareRoutes';
import LoginPage from './pages/LoginPage';
import UserpanelPage from './pages/UserpanelPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
          <ProtectedRoute>
            <LoginPage />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <UserpanelPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;