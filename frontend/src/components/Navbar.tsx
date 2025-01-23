import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import axios from 'axios';

export const  Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('https://usermanagement-production-5349.up.railway.app/api/logout', { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
      <nav className="bg-white shadow-sm">
        <div className="  mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-9 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
  );
};

 