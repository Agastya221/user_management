import React from "react";
import Sidebar from "../components/Sidenavbar"; 
import UserManagementTable from "../components/Userspanel";
import {Navbar} from "@/components/Navbar";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-2">
        <Navbar />
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
        <UserManagementTable />

          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
