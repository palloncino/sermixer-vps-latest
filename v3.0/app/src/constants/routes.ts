import { APP_CONFIG } from '../config/app-config';

// Centralized routing configuration
// To switch back to v2.0, just change USE_V3_ROUTES to false in app-config.ts
const USE_V3_ROUTES = APP_CONFIG.USE_V3_ROUTES;

// Base URLs for different environments
const V2_BASE = '';
const V3_BASE = '/v3.0';

// Helper function to get the correct base URL
const getBaseUrl = () => USE_V3_ROUTES ? V3_BASE : V2_BASE;

// Route definitions with dynamic base URL
export const ROUTES = {
  // Dashboard
  dashboard: () => `${getBaseUrl()}/`,
  
  // Documents
  documentsList: () => `${getBaseUrl()}/documents-list`,
  createDocument: () => `${getBaseUrl()}/create-document`,
  documentDetail: (hash: string) => `${getBaseUrl()}/documents/${hash}`,
  
  // Products
  productList: () => `${getBaseUrl()}/products-list`,
  createProduct: () => `${getBaseUrl()}/create-product`,
  productDetail: (id: string) => `${getBaseUrl()}/product/${id}`,
  
  // Clients
  clientsList: () => `${getBaseUrl()}/clients-list`,
  createClient: () => `${getBaseUrl()}/create-client`,
  clientDetail: (id: string) => `${getBaseUrl()}/clients/${id}`,
  
  // Users
  usersList: () => `${getBaseUrl()}/users-list`,
  createUser: () => `${getBaseUrl()}/signup`,
  userDetail: (id: string) => `${getBaseUrl()}/users/${id}`,
  
  // PDFs
  pdfManagement: () => `${getBaseUrl()}/pdf-management`,
  
  // Auth
  login: () => `${getBaseUrl()}/login`,
  register: () => `${getBaseUrl()}/register`,
  
  // Legacy v2.0 routes (for backward compatibility)
  v2ClientPreventive: (hash: string) => `/client-preventive/${hash}`,
  
  // Utility function to check if we're using v3 routes
  isV3: () => USE_V3_ROUTES,
  
  // Function to get current base URL
  getBase: () => getBaseUrl(),
  
  // Function to switch routes (for future use)
  switchToV2: () => {
    console.warn('To switch to v2.0 routes, change USE_V3_ROUTES to false in app-config.ts');
    return V2_BASE;
  },
  
  switchToV3: () => {
    console.warn('To switch to v3.0 routes, change USE_V3_ROUTES to true in app-config.ts');
    return V3_BASE;
  }
};

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
