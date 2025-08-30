import { useState, useCallback } from 'react';

export interface SimpleChange {
  id: string;
  productIndex: number;
  productName: string;
  changeType: 'price' | 'discount' | 'description' | 'components';
  timestamp: string;
}

export const useSimpleChangeTracking = () => {
  const [changes, setChanges] = useState<SimpleChange[]>([]);
  const [originalHash, setOriginalHash] = useState<string>('');

  const initializeTracking = useCallback((documentHash: string) => {
    if (!originalHash) {
      setOriginalHash(documentHash);
      setChanges([]);
    }
  }, [originalHash]);

  const trackChange = useCallback((
    productIndex: number, 
    productName: string, 
    changeType: 'price' | 'discount' | 'description' | 'components'
  ) => {
    const changeId = `${productIndex}-${changeType}`;
    
    setChanges(prevChanges => {
      // Remove existing change of same type for same product
      const filteredChanges = prevChanges.filter(change => change.id !== changeId);
      
      // Add new change
      const newChange: SimpleChange = {
        id: changeId,
        productIndex,
        productName,
        changeType,
        timestamp: new Date().toLocaleString('it-IT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      return [...filteredChanges, newChange];
    });
  }, []);

  const clearChanges = useCallback(() => {
    setChanges([]);
    setOriginalHash('');
  }, []);

  const getChangesSummary = useCallback(() => {
    // Group changes by product
    const grouped = changes.reduce((acc, change) => {
      const key = `${change.productIndex}-${change.productName}`;
      if (!acc[key]) {
        acc[key] = {
          productIndex: change.productIndex,
          productName: change.productName,
          changes: [],
          timestamp: change.timestamp
        };
      }
      acc[key].changes.push(change.changeType);
      // Use latest timestamp
      if (change.timestamp > acc[key].timestamp) {
        acc[key].timestamp = change.timestamp;
      }
      return acc;
    }, {} as Record<string, {
      productIndex: number;
      productName: string;
      changes: string[];
      timestamp: string;
    }>);

    return Object.values(grouped);
  }, [changes]);

  return {
    changes,
    initializeTracking,
    trackChange,
    clearChanges,
    getChangesSummary,
    hasChanges: changes.length > 0
  };
};
