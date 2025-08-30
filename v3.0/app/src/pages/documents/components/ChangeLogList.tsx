import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import React from 'react';
import { ChangeLogItem } from '../../../types';
import { useDocumentContext } from 'state/documentContext';

interface ChangeLogListProps {
  changeLogs: ChangeLogItem[];
}

const ChangeLogList: React.FC<ChangeLogListProps> = ({ changeLogs }) => {
  const { updatedDocumentData, simpleChanges, hasSimpleChanges } = useDocumentContext();

  const parseDetailsString = (details: string) => {
    const fromMatch = details.match(/__from__(.*?)__to__/);
    const toMatch = details.match(/__to__(.*)$/);

    const fromValue = fromMatch ? JSON.parse(fromMatch[1]) : 'Unknown';
    const toValue = toMatch ? JSON.parse(toMatch[1]) : 'Unknown';

    return { fromValue, toValue };
  };

  // Use simple changes if available, fallback to old method
  if (!hasSimpleChanges || simpleChanges.length === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No changes detected
        </Typography>
      </Box>
    );
  }

  const hasMultipleProducts = simpleChanges.length > 1;

  return (
    <Box>
      {simpleChanges.map((change, index) => {
        const productName = `${change.productName} (#${change.productIndex + 1})`;
        
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {/* Product header - only show if multiple products */}
            {hasMultipleProducts && (
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                fontSize: '0.875rem'
              }}>
                {productName}
              </Typography>
            )}
            
            {/* Simple changes summary */}
            <Box sx={{ pl: hasMultipleProducts ? 2 : 0 }}>
              <Typography variant="body2" sx={{ 
                fontSize: '0.875rem',
                color: 'text.primary',
                mb: 0.25
              }}>
                • {hasMultipleProducts ? '' : `${productName} - `}{change.changes.join(', ')} modified
              </Typography>
              <Typography variant="caption" sx={{ 
                fontSize: '0.75rem',
                color: 'text.secondary',
                pl: 1.5
              }}>
                {change.timestamp}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChangeLogList;

