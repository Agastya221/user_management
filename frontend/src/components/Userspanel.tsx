import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Pencil, Trash2 } from "lucide-react";
import {useEditUserContext} from '@/context/UserContext';

interface User {
  _id: number;
  name: string;
  dateOfBirth: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}



interface StatusIndicatorProps {
  status: "active" | "inactive";
}

// Helper functions
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusStyles = {
    active: {
      dot: "bg-green-500",
      text: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    inactive: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  };

  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 ${style.dot} rounded-full mr-1.5`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};



const UserManagementTable: React.FC = () => {
  const { userIdToEdit, setUserIdToEdit, editForm, setEditForm } = useEditUserContext(); 
  const [users, setUsers] = useState<User[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  

  // Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getallusers');
        setUsers(response.data); 
        console.log('Fetched users:', response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  console.log('users:', users);

  // Handle edit click
  const handleEditClick = (userId: number): void => {
    const user = users.find((user) => user._id === userId);
    console.log('Editing user:', user);
    if (user) {
      setUserIdToEdit(user._id);
      setEditForm({
        name: user.name,
        dateOfBirth: user.dateOfBirth.toString().split("T")[0],
        email: user.email,
        role: user.role,
        status: user.status,
      });
      setShowEditDialog(true);
    }
  };

  // Handle edit submission
  const handleEdit = async (): Promise<void> => {
    if (userIdToEdit === null) {
      console.error('No user selected for editing.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${userIdToEdit}`, {
        name: editForm.name,
        dateOfBirth: editForm.dateOfBirth,
        email: editForm.email,
        role: editForm.role,
        status: editForm.status,
      });

      setUsers((prevUsers) =>
        prevUsers.map((existingUser) =>
          existingUser._id === userIdToEdit ? { ...existingUser, ...editForm, status: editForm.status as "active" | "inactive" } : existingUser
        )
      );
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle delete click
  const handleDeleteClick = (userId: number): void => {
    setUserIdToEdit(userId); // Store the ID of the user to delete
    setShowDeleteDialog(true);
  };

  // Handle delete submission
  const handleDelete = async (): Promise<void> => {
    if (userIdToEdit === null) {
      console.error('No user selected for deletion.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${userIdToEdit}`);
      setUsers(users.filter((user) => user._id !== userIdToEdit));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="font-sans overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-medium text-black">Name</th>
            <th className="p-4 text-left text-sm font-medium text-black">DOB</th>
            <th className="p-4 text-left text-sm font-medium text-black">Role</th>
            <th className="p-4 text-left text-sm font-medium text-black">Status</th>
            <th className="p-4 text-left text-sm font-medium text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr className={index % 2 === 0 ? 'bg-blue-50' : ''} key={user._id}>
              <td className="p-4 text-sm">
                <div className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                      user.name
                    )}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-black">{user.name}</p>
                    <p className="text-xs font-semibold text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm font-semibold text-black">{user.dateOfBirth.toString().split("T")[0]}</td>
              <td className="p-4 text-sm font-semibold text-black">{user.role}</td>
              <td className="p-4">
                <StatusIndicator status={user.status} />
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleEditClick(user._id)}
                  className="p-2 hover:bg-gray-100 rounded-full mr-2"
                >
                  <Pencil className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleDeleteClick(user._id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Name"
            />
            <label htmlFor="dob" className="text-sm font-medium">
              Date of Birth
            </label>
            <Input
              id="dob"
              value={editForm.dateOfBirth}
              onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
              placeholder="DOB (YYYY-MM-DD)"
            />
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email"
            />
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
            </select>

            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'inactive' })}
              className="block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagementTable;


