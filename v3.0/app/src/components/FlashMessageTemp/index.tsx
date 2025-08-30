import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { styled } from '@mui/system';
import { useFlashMessage } from '../../state/FlashMessageContext';

const StyledSnackbar = styled(Snackbar)({
  position: 'fixed',
  bottom: '16px', // Fixed bottom spacing
  left: '16px', // Fixed left spacing
  transform: 'none',
  zIndex: 9999,
  maxWidth: '90%', // Limit width on small screens
  '& .MuiAlert-root': {
    width: '100%',
    boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)',
  },
});

const FlashMessageTemp: React.FC = () => {
  const { currentMessage, hideMessage } = useFlashMessage();

  useEffect(() => {
    if (currentMessage) {
      const timer = setTimeout(() => {
        hideMessage();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [currentMessage, hideMessage]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideMessage();
  };

  return (
    <StyledSnackbar 
      open={!!currentMessage} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={currentMessage?.type || 'info'} 
        sx={{ width: '100%' }}
        variant="filled"
      >
        {currentMessage?.message || ''}
      </Alert>
    </StyledSnackbar>
  );
};

export default FlashMessageTemp;
