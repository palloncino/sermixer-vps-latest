import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Base styled button with manly/audacious design
const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderRadius: 1, // Square corners
  border: '2px solid #000000',
  transition: 'all 0.2s ease',
  
  // Base styles
  ...(variant === 'contained' && {
    backgroundColor: '#000000',
    color: '#ffffff',
  '&:hover': {
    backgroundColor: '#333333',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  }),
  
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    color: '#000000',
  '&:hover': {
    backgroundColor: '#000000',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  }),
  
  ...(variant === 'text' && {
    backgroundColor: 'transparent',
    color: '#000000',
    border: 'none',
  '&:hover': {
    backgroundColor: '#f8f9fa',
  },
  }),
  
  // Size variants
  ...(size === 'small' && {
    padding: '6px 16px',
    fontSize: '0.75rem',
    minHeight: '32px',
  }),
  
  ...(size === 'medium' && {
    padding: '8px 24px',
    fontSize: '0.875rem',
    minHeight: '40px',
  }),
  
  ...(size === 'large' && {
    padding: '12px 32px',
    fontSize: '1rem',
    minHeight: '48px',
  }),
  
  // Disabled state
  '&:disabled': {
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    borderColor: '#e5e7eb',
    transform: 'none',
    boxShadow: 'none',
  },

  backgroundColor: 'red!important'
}));

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'contained', 
  size = 'medium',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
