import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './middleware/MiddlewareRoutes';
import LoginPage from './pages/LoginPage';
import UserpanelPage from './pages/UserpanelPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/api/login" replace />} />
        
        <Route path="/api/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
                
        <Route path="/api/users" element={
          <ProtectedRoute>
            <UserpanelPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;