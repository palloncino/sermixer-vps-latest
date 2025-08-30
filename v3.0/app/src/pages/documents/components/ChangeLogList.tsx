import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { ChangeLogItem } from '../../../types';
import { useDocumentContext } from 'state/documentContext';

interface ChangeLogListProps {
  changeLogs: ChangeLogItem[];
}

const ChangeLogList: React.FC<ChangeLogListProps> = ({ changeLogs }) => {
  const { updatedDocumentData } = useDocumentContext();

  const parseDetailsString = (details: string) => {
    const fromMatch = details.match(/__from__(.*?)__to__/);
    const toMatch = details.match(/__to__(.*)$/);

    const fromValue = fromMatch ? JSON.parse(fromMatch[1]) : 'Unknown';
    const toValue = toMatch ? JSON.parse(toMatch[1]) : 'Unknown';

    return { fromValue, toValue };
  };

  const formatChangeDetails = (change: ChangeLogItem) => {
    const { property, details, timestamp } = change;
    const { fromValue, toValue } = parseDetailsString(details);

    // Skip logging if both fromValue and toValue are null, or they are the same
    if ((fromValue === null && toValue === null) || fromValue === toValue) return null;

    let formattedChange = '';

    // Handle changes related to added products
    if (property.includes('data.addedProducts')) {
      const productMatch = property.match(/data\.addedProducts\[(\d+)\]/);
      const componentMatch = property.match(/components\[(\d+)\]/);
      const productIndex = productMatch ? parseInt(productMatch[1]) : null;
      const componentIndex = componentMatch ? parseInt(componentMatch[1]) : null;

      if (productIndex !== null && updatedDocumentData?.data?.addedProducts?.[productIndex]) {
        const productName = updatedDocumentData.data.addedProducts[productIndex].name || `Product ${productIndex + 1}`;

        // If a component is changed
        if (componentIndex !== null && updatedDocumentData.data.addedProducts[productIndex].components?.[componentIndex]) {
          const componentName = updatedDocumentData.data.addedProducts[productIndex].components[componentIndex].name || `Component ${componentIndex + 1}`;

          if (property.includes('included')) {
            formattedChange = `${productName} > ${componentName} is now ${toValue ? 'Included' : 'Excluded'}`;
          } else if (property.includes('quantity')) {
            formattedChange = `${productName} > ${componentName} quantity changed from ${fromValue} to ${toValue}`;
          } else if (property.includes('discount')) {
            formattedChange = `${productName} > ${componentName} discount changed from ${fromValue}% to ${toValue}%`;
          } else {
            formattedChange = `${productName} > ${componentName} changed from ${fromValue} to ${toValue}`;
          }
        } else {
          // If a product is changed
          if (property.includes('price')) {
            formattedChange = `${productName} price changed from ${fromValue} to ${toValue}`;
          } else if (property.includes('discount')) {
            formattedChange = `${productName} discount changed from ${fromValue}% to ${toValue}%`;
          } else if (property.includes('description')) {
            formattedChange = `${productName} description changed.`;
          }
        }
      }
    }
    // Handle changes in quote head details
    else if (property.includes('quoteHeadDetails')) {
      if (property.includes('object')) {
        formattedChange = `Quote object changed.`;
      } else if (property.includes('description')) {
        formattedChange = `Quote description changed.`;
      }
    }
    // General case for other properties
    else {
      formattedChange = `Changed from ${fromValue} to ${toValue}`;
    }

    return {
      primary: formattedChange,
      secondary: timestamp,
    };
  };

  return (
    <List dense>
      {changeLogs.map((change, index) => {
        const formattedChange = formatChangeDetails(change);
        if (!formattedChange) return null; // Skip if no valid change
        const { primary, secondary } = formattedChange;

        return (
          <ListItem key={index}>
            <ListItemText
              primary={primary}
              secondary={secondary}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default ChangeLogList;
