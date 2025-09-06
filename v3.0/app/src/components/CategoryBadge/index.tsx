import React from 'react';
import { Chip } from '@mui/material';
import { getCategoryColor, getCategoryDisplayName } from '../../utils/categoryColors';

interface CategoryBadgeProps {
  category: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'small',
  variant = 'filled' 
}) => {
  const colors = getCategoryColor(category);
  const displayName = getCategoryDisplayName(category);

  return (
    <Chip
      label={displayName}
      size={size}
      variant={variant}
      sx={{
        backgroundColor: variant === 'filled' ? colors.background : 'transparent',
        color: colors.color,
        borderColor: colors.border,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        height: size === 'small' ? '24px' : '32px',
        '& .MuiChip-label': {
          px: 1.5,
          py: 0.5
        }
      }}
    />
  );
};

export default CategoryBadge;
