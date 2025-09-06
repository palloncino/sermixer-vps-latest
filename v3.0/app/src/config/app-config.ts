// App Configuration - Easy switching between v2.0 and v3.0
export const APP_CONFIG = {
  // ===========================================
  // 🚀 ROUTING CONFIGURATION
  // ===========================================
  
  // To switch between v2.0 and v3.0, change this value:
  // true = v3.0 routes (no prefix, direct routes)
  // false = v2.0 routes (no prefix, direct routes)
  USE_V3_ROUTES: true,
  
  // ===========================================
  // 📱 APP SETTINGS
  // ===========================================
  APP_NAME: 'Sermixer Quotation App',
  VERSION: '3.0',
  
  // ===========================================
  // 🔧 FEATURE FLAGS
  // ===========================================
  ENABLE_NEW_DASHBOARD: true,
  ENABLE_PDF_MANAGEMENT: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  
  // ===========================================
  // 📊 DISPLAY SETTINGS
  // ===========================================
  DASHBOARD_ROWS_PER_PAGE: 8,
  MAX_PDF_PREVIEW_SIZE: 10 * 1024 * 1024, // 10MB
  
  // ===========================================
  // 🎨 UI SETTINGS
  // ===========================================
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    SUCCESS_COLOR: '#4caf50',
    WARNING_COLOR: '#ff9800',
    ERROR_COLOR: '#f44336',
    INFO_COLOR: '#2196f3'
  }
};

// Helper function to get current routing mode
export const getRoutingMode = () => {
  return APP_CONFIG.USE_V3_ROUTES ? 'v3.0' : 'v2.0';
};

// Helper function to check if we're in v3.0 mode
export const isV3Mode = () => APP_CONFIG.USE_V3_ROUTES;

// Helper function to get base URL for routes
export const getBaseUrl = () => {
  return '';
};

// Export for easy access
export default APP_CONFIG;
