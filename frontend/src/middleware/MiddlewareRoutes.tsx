import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../components/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(
          'https://usermanagement-production-5349.up.railway.app/api/auth/status',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            try {
              // Attempt token refresh
              await axios.get(
                'https://usermanagement-production-5349.up.railway.app/api/refreshtoken',
                { withCredentials: true }
              );
              setIsAuthenticated(true);
            } catch {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    verifyAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center"><Loading /></div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(
          'https://usermanagement-production-5349.up.railway.app/api/auth/status',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.authenticated);
      } catch  {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loading fullScreen />;
  }

  return isAuthenticated ? <Navigate to="/users" replace /> : children;
};

export { ProtectedRoute, PublicRoute };