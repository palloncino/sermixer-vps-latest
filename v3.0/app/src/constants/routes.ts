import { APP_CONFIG } from '../config/app-config';

// Centralized routing configuration
// To switch back to v2.0, just change USE_V3_ROUTES to false in app-config.ts
const USE_V3_ROUTES = APP_CONFIG.USE_V3_ROUTES;

// Base URLs for different environments
const V2_BASE = '';
const V3_BASE = '';

// Helper function to get the correct base URL
// Since we're already running in v3.0 context, we don't need to add v3.0 prefix
const getBaseUrl = () => '';

// Route definitions with dynamic base URL - function style for backward compatibility
export const ROUTES = (id: string | number = "") => ({
  // Dashboard
  dashboard: `/`,
  
  // Documents
  documentsList: `${getBaseUrl()}/documents-list`,
  createDocument: `${getBaseUrl()}/create-document`,
  documentDetail: `${getBaseUrl()}/documents/${id}`,
  
  // Products
  productList: `${getBaseUrl()}/products-list`,
  createProduct: `${getBaseUrl()}/create-product`,
  productDetail: `${getBaseUrl()}/product/${id}`,
  editProduct: `${getBaseUrl()}/edit-product/${id}`,
  productPage: `${getBaseUrl()}/product/${id}`,
  
  // Clients
  clientsList: `${getBaseUrl()}/clients-list`,
  createClient: `${getBaseUrl()}/create-client`,
  clientDetail: `${getBaseUrl()}/client/${id}`,
  editClient: `${getBaseUrl()}/edit-client/${id}`,
  clientPage: `${getBaseUrl()}/client/${id}`,
  
  // Users
  usersList: `${getBaseUrl()}/users-list`,
  createUser: `${getBaseUrl()}/signup`,
  userDetail: `${getBaseUrl()}/user/${id}`,
  editUser: `${getBaseUrl()}/edit-user/${id}`,
  userPage: `${getBaseUrl()}/user/${id}`,
  profile: `${getBaseUrl()}/profile`,
  
  // PDFs
  pdfManagement: `${getBaseUrl()}/pdf-management`,
  
  // Auth
  login: `${getBaseUrl()}/login`,
  register: `${getBaseUrl()}/register`,
  
  // Legacy v2.0 routes (for backward compatibility)
  sharedDocument: `/client-preventive/${id}`,
  
  // Quotes (legacy compatibility)
  quotesList: `${getBaseUrl()}/quotes-list`,
  editQuote: `${getBaseUrl()}/edit-quote/${id}`,
  
  // Utility functions
  isV3: () => USE_V3_ROUTES,
  getBase: () => getBaseUrl()
});

// Export the flag for easy access
export { USE_V3_ROUTES };

// Legacy route mapping for backward compatibility
export const LEGACY_ROUTES = {
  documentsList: '/documents-list',
  createDocument: '/create-document',
  productList: '/products-list',
  createProduct: '/create-product',
  clientsList: '/clients-list',
  createClient: '/create-client',
  usersList: '/users-list',
  createUser: '/signup',
  login: '/login',
  register: '/signup'
};
