import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Pencil, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  dob: string; // Added Date of Birth field
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface EditFormData {
  name: string;
  dob: string; // Added Date of Birth field
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface StatusIndicatorProps {
  status: 'active' | 'inactive';
}

// Function to generate initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Function to generate a consistent color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const UserManagementTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Gladys Jones",
      dob: "1990-02-15", // Static DOB
      email: "gladys@example.com",
      role: "Admin",
      status: "active"
    },
    {
      id: 2,
      name: "Jennie Cooper",
      dob: "1987-07-20", // Static DOB
      email: "jennie@example.com",
      role: "Candidate",
      status: "active"
    },
    {
      id: 3,
      name: "Philip Steward",
      dob: "1995-11-05", // Static DOB
      email: "philip@example.com",
      role: "Candidate",
      status: "active"
    },
    {
      id: 4,
      name: "Jorge Black",
      dob: "1998-06-30", // Static DOB
      email: "jorge@example.com",
      role: "User",
      status: "inactive"
    },
    {
      id: 5,
      name: "Evan Flores",
      dob: "1992-12-10", // Static DOB
      email: "evan@example.com",
      role: "User",
      status: "inactive"
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    dob: '', // Added Date of Birth to edit form
    email: '',
    role: '',
    status: 'active'
  });

  const handleEditClick = (user: User): void => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      dob: user.dob, // Populate DOB in the edit form
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (user: User): void => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleEdit = (): void => {
    if (!selectedUser) return;

    const updatedUser = { ...selectedUser, ...editForm };
    setUsers(users.map(user => (user.id === selectedUser.id ? updatedUser : user)));
    setShowEditDialog(false);
  };

  const handleDelete = (): void => {
    if (!selectedUser) return;

    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteDialog(false);
  };

  const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    const statusStyles = {
      active: {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-100"
      },
      inactive: {
        dot: "bg-red-500",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-100"
      }
    };

    const style = statusStyles[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
        <span className={`w-1.5 h-1.5 ${style.dot} rounded-full mr-1.5`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="font-sans overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-black">Name</th>
            <th className="p-4 text-left text-sm font-semibold text-black">DOB</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Role</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-black">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'bg-blue-50' : ''}>
              <td className="p-4 text-sm">
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(user.name)}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-black">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm text-black">{user.dob}</td>
              <td className="p-4 text-sm text-black">{user.role}</td>
              <td className="p-4">
                <StatusIndicator status={user.status} />
              </td>
              <td className="p-4">
                <button onClick={() => handleEditClick(user)} className="p-2 hover:bg-gray-100 rounded-full mr-2">
                  <Pencil className="w-5 h-5 text-blue-500" />
                </button>
                <button onClick={() => handleDeleteClick(user)} className="p-2 hover:bg-gray-100 rounded-full">
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
            <label htmlFor="name" className="text-sm font-medium ">Name</label>
            <Input
              id="name"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Name"
              
            />
            <label htmlFor="dob" className="text-sm font-medium ">Date of Birth</label>
            <Input
              id="dob"
              value={editForm.dob}
              onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
              placeholder="DOB (YYYY-MM-DD)"
            />
            <label htmlFor="email" className="text-sm font-medium ">Email</label>
            <Input
              id="email"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email"
            />
            <label htmlFor="role" className="text-sm font-medium ">Role</label>
            <Input
              id="role"
              value={editForm.role}
              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              placeholder="Role"
            />
            <label htmlFor="status" className="text-sm font-medium ">Status</label>
            <select
              id="status"
              value={editForm.status}
              onChange={e => setEditForm({ ...editForm, status: e.target.value as 'active' | 'inactive' })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagementTable;








