import axios, { AxiosRequestConfig } from 'axios';

interface RequestConfig extends AxiosRequestConfig {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

// This function will be set from a React component
let navigateFunction: ((path: string) => void) | null = null;

export const setNavigateFunction = (navFunc: (path: string) => void) => {
  navigateFunction = navFunc;
};

const handleAuthError = () => {
  localStorage.removeItem('authToken');
  if (navigateFunction) {
    navigateFunction('/login');
  } else {
    console.error('Navigate function not set. Unable to redirect to login.');
  }
};

// Enhanced error handling with specific messages
const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        return data?.message || 'Bad request. Please check your input.';
      case 401:
        return 'Invalid email or password. Please try again.';
      case 403:
        return 'Access denied. Please log in again.';
      case 404:
        return 'Service not found. Please check the URL.';
      case 422:
        return data?.message || 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Server is taking too long to respond.';
      default:
        if (data?.message) {
          return data.message;
        }
        if (error.code === 'ECONNABORTED') {
          return 'Request timeout. Please check your connection and try again.';
        }
        if (error.code === 'ERR_NETWORK') {
          return 'Network error. Please check your internet connection.';
        }
        if (error.code === 'ERR_BAD_OPTION') {
          return 'Configuration error. Please contact support.';
        }
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  // Handle non-Axios errors
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const request = async ({ url, method = 'GET', body = null, headers = {}, isFormData = false }: RequestConfig) => {
  const authToken = localStorage.getItem('authToken');

  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {
      ...headers,
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
    timeout: 30000, // 30 second timeout
  };

  if (body) {
    if (isFormData) {
      config.data = body;
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.data = JSON.stringify(body);
      config.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.error('Authentication error: ', error.response.data);
        handleAuthError();
      }
      
      // Create a more informative error object
      const enhancedError = new Error(getErrorMessage(error));
      enhancedError.name = 'RequestError';
      enhancedError.cause = error;
      
      // Add additional context
      Object.defineProperty(enhancedError, 'status', {
        value: error.response?.status,
        writable: false
      });
      
      Object.defineProperty(enhancedError, 'originalError', {
        value: error,
        writable: false
      });
      
      throw enhancedError;
    }
    throw error;
  }
};
