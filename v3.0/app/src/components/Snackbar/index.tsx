import React, { useState, useEffect, FC } from 'react';
import MUISnackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface SnackbarProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
  onClose: () => void;
}

const Snackbar: FC<SnackbarProps> = ({ message, type, open: propOpen, onClose }) => {
  const [open, setOpen] = useState(propOpen);

  useEffect(() => {
    setOpen(propOpen);
  }, [propOpen]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <MUISnackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      action={
        <Button color="inherit" size="small" onClick={handleClose}>
          Close
        </Button>
      }
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MUISnackbar>
  );
};

export default Snackbar;