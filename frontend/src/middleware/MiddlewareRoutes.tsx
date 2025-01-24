import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../components/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check authentication status
        await axios.get(
          'https://usermanagement-production-5349.up.railway.app/api/auth',
          { withCredentials: true }
        );
        setIsAuthenticated(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            try {
              // Attempt to refresh access token
              await axios.get(
                'https://usermanagement-production-5349.up.railway.app/api/refreshtoken',
                { withCredentials: true }
              );
              setIsAuthenticated(true);
              return;
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  }

  if (!isAuthenticated) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          'https://usermanagement-production-5349.up.railway.app/api/auth',
          { withCredentials: true }
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }


  return isAuthenticated ? <Navigate to="/users" replace /> : children;
};

export { ProtectedRoute, PublicRoute };