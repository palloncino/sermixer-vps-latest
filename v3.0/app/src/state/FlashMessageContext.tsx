// src/contexts/FlashMessageContext.tsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { AlertColor } from '@mui/material';

interface FlashMessage {
  message: string;
  type: AlertColor;
}

interface FlashMessageContextType {
  showMessage: (message: string, type: AlertColor) => void;
  currentMessage: FlashMessage | null;
  hideMessage: () => void;
}

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(undefined);

export const FlashMessageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState<FlashMessage | null>(null);

  const showMessage = useCallback((message: string, type: AlertColor) => {
    setCurrentMessage({ message, type });
  }, []);

  const hideMessage = useCallback(() => {
    setCurrentMessage(null);
  }, []);

  return (
    <FlashMessageContext.Provider value={{ showMessage, currentMessage, hideMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (context === undefined) {
    throw new Error('useFlashMessage must be used within a FlashMessageProvider');
  }
  return context;
};