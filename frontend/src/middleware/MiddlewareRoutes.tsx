import { Navigate, useLocation } from 'react-router-dom';
import axios,{ AxiosError } from 'axios';
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
        // Try to access a protected route to verify token
        await axios.get('https://usermanagement-production-5349.up.railway.app/api/auth');
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                // Token expired, try to refresh
                try {
                  await axios.get('https://usermanagement-production-5349.up.railway.app/api/refreshtoken',{withCredentials: true});
                  setIsAuthenticated(true);
                } catch ( error ) {
                  setIsAuthenticated(false);
                  console.log(error);
                }
              } 
              else {
                setIsAuthenticated(false);
              }
        }
        
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className='flex justify-center items-center'><Loading /></div> ;
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};


export { ProtectedRoute };