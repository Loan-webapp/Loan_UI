import React, { createContext, useContext, useState } from "react";

export interface Customer {
  _id?: string;   // from MongoDB
  name: string;
  phone: string;
}

export interface Loan {
  _id?: string;
  customer: string; // customer _id
  principal: number;
  interest: number;
  duration: number;
}

export interface Due {
  _id?: string;
  loan: string;
  dueDate: string;
  dueAmount: number;
  status: string;
}

interface AppContextType {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <AppContext.Provider value={{ customers, setCustomers, selectedCustomer, setSelectedCustomer }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
