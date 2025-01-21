import React from "react";
import Sidebar from "../components/Sidenavbar"; // Ensure this path is correct
import UserManagementTable from "../components/Userspanel"; // Adjust the import path as needed

const RegisterPage: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <UserManagementTable />
      </div>
    </div>
  );
};

export default RegisterPage;
