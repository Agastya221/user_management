import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditFormData {
  name: string;
  dateOfBirth: string;
  email: string;
  role: string;
  status: string;
}

interface EditUserContextProps {
  userIdToEdit: number | null;
  setUserIdToEdit: (id: number | null) => void;
  editForm: EditFormData;
  setEditForm: React.Dispatch<React.SetStateAction<EditFormData>>;
}

const EditUserContext = createContext<EditUserContextProps | undefined>(undefined);

export const useEditUserContext = (): EditUserContextProps => {
  const context = useContext(EditUserContext);
  if (!context) {
    throw new Error("useEditUserContext must be used within a EditUserProvider");
  }
  return context;
};

export const EditUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userIdToEdit, setUserIdToEdit] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    dateOfBirth: '',
    email: '',
    role: '',
    status: 'active',
  });

  return (
    <EditUserContext.Provider value={{ userIdToEdit, setUserIdToEdit, editForm, setEditForm }}>
      {children}
    </EditUserContext.Provider>
  );
};
