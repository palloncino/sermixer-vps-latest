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
  const auth = useAuth();
  const users = useUsers();
  const clients = useClients();
  const products = useProducts();
  const quotes = useQuotes();

  // Create stable references to prevent unnecessary re-renders
  const state = useMemo(() => ({
    // Auth state
    verifyToken: auth.verifyToken,
    user: auth.user,
    token: auth.token,
    isLoadingAuthorization: auth.isLoadingAuthorization,
    logout: auth.logout,
    login: auth.login,
    loginIsLoading: auth.loginIsLoading,
    loginError: auth.loginError,
    signup: auth.signup,
    signupIsLoading: auth.signupIsLoading,
    signupError: auth.signupError,
    signupSuccessMessage: auth.signupSuccessMessage,
    
    // Users state
    users: users.users,
    getUsers: users.getUsers,
    getUsersIsLoading: users.getUsersIsLoading,
    getUsersError: users.getUsersError,
    addUser: users.addUser,
    addUserIsLoading: users.addUserIsLoading,
    addUserError: users.addUserError,
    editUser: users.editUser,
    editUserIsLoading: users.editUserIsLoading,
    editUserError: users.editUserError,
    deleteUsers: users.deleteUsers,
    deleteUserIsLoading: users.deleteUserIsLoading,
    deleteUserError: users.deleteUserError,
    
    // Clients state
    clients: clients.clients,
    getClients: clients.getClients,
    getClientsIsLoading: clients.getClientsIsLoading,
    getClientsError: clients.getClientsError,
    addClient: clients.addClient,
    addClientIsLoading: clients.addClientIsLoading,
    addClientError: clients.addClientError,
    editClient: clients.editClient,
    editClientIsLoading: clients.editClientIsLoading,
    editClientError: clients.editClientError,
    deleteClients: clients.deleteClients,
    deleteClientIsLoading: clients.deleteClientIsLoading,
    deleteClientError: clients.deleteClientError,
    
    // Products state
    products: products.products,
    getProducts: products.getProducts,
    getProductsIsLoading: products.getProductsIsLoading,
    getProductsError: products.getProductsError,
    addProduct: products.addProduct,
    addProductIsLoading: products.addProductIsLoading,
    setAddProductError: products.setAddProductError,
    addProductError: products.addProductError,
    editProduct: products.editProduct,
    editProductIsLoading: products.editProductIsLoading,
    editProductError: products.editProductError,
    deleteProducts: products.deleteProducts,
    deleteProductIsLoading: products.deleteProductIsLoading,
    deleteProductError: products.deleteProductError,
    handleSaveProduct: products.handleSaveProduct,
    getProductById: products.getProductById,
    loading: products.loading,
    error: products.error,
    
    // Quotes state
    quotes: quotes.quotes,
    getQuotes: quotes.getQuotes,
    getQuotesIsLoading: quotes.getQuotesIsLoading,
    getQuotesError: quotes.getQuotesError,
    createQuote: quotes.createQuote,
    createQuoteIsLoading: quotes.createQuoteIsLoading,
    createQuoteError: quotes.createQuoteError,
    deleteQuotes: quotes.deleteQuotes,
    deleteQuoteIsLoading: quotes.deleteQuoteIsLoading,
    deleteQuoteError: quotes.deleteQuoteError,
  }), [
    // Only include primitive values and stable references
    auth.user, auth.token, auth.isLoadingAuthorization, auth.loginIsLoading, auth.loginError,
    auth.signupIsLoading, auth.signupError, auth.signupSuccessMessage,
    users.users, users.getUsersIsLoading, users.getUsersError, users.addUserIsLoading,
    users.addUserError, users.editUserIsLoading, users.editUserError, users.deleteUserIsLoading, users.deleteUserError,
    clients.clients, clients.getClientsIsLoading, clients.getClientsError, clients.addClientIsLoading,
    clients.addClientError, clients.editClientIsLoading, clients.editClientError, clients.deleteClientIsLoading, clients.deleteClientError,
    products.products, products.getProductsIsLoading, products.getProductsError, products.addProductIsLoading,
    products.addProductError, products.editProductIsLoading, products.editProductError, products.deleteProductIsLoading,
    products.deleteProductError, products.loading, products.error,
    quotes.quotes, quotes.getQuotesIsLoading, quotes.getQuotesError, quotes.createQuoteIsLoading,
    quotes.createQuoteError, quotes.deleteQuoteIsLoading, quotes.deleteQuoteError
  ]);

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};
