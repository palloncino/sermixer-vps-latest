import React, { createContext, useContext, useMemo, useState } from "react";
import { AppStateContextType } from "types/index";
import { useAuth } from "../hooks/useAuth";
import { useClients } from "../hooks/useClients";
import { useProducts } from "../hooks/useProducts";
import { useQuotes } from "../hooks/useQuotes";
import { useUsers } from "../hooks/useUsers";

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const auth = useAuth();
  const users = useUsers();
  const clients = useClients();
  const products = useProducts();
  const quotes = useQuotes();

  const state = useMemo(() => ({
    ...auth,
    ...users,
    ...clients,
    ...products,
    ...quotes,
  }), [auth, users, clients, products, quotes, updateTrigger]);

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};
