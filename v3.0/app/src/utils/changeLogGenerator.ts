import _ from 'lodash';
import { ChangeLogItem, DocumentDataType } from '../types';
import { dateText } from '../utils/date-text';

// Add this helper function
function safeDateText(date: any): string {
  return date ? dateText(date) : '';
}

function safeToZero(value: any): number {
  return value ? Number(value) : 0;
}

const propertyLabelMap = {
  "clientSignature": "Client Signature",
  "ownerSignature": "Owner Signature",
  "status": "Status",
  "followUpSent": "Follow Up Sent",
  "readonly": "Read-Only Status",
  "note": "Note",
  "dateOfSignature": "Date of signature",
  "data.uploadedFiles": "Uploaded Files",
  "data.addedProducts": "Product",
  "name": "Name",
  "description": "Description",
  "price": "Price",
  "components": "Component",
  "included": "Inclusion",
  "discount": "Discount"
};

const comparisonRules = {
  checkbox: (oldValue: any, newValue: any) => oldValue !== newValue,
  price: (oldValue: any, newValue: any) => safeToZero(oldValue) !== safeToZero(newValue),
  discount: (oldValue: any, newValue: any) => safeToZero(oldValue) !== safeToZero(newValue),
  discountedPrice: (oldValue: any, newValue: any) => safeToZero(oldValue) !== safeToZero(newValue),
};

function generateChangeLogs(originalData: DocumentDataType, currentData: DocumentDataType): ChangeLogItem[] {
  const changes: ChangeLogItem[] = [];
  const now = new Date();

  function compareValues(path: string, originalValue: any, currentValue: any) {
    const propertyName = path.split('.').pop();
    const rule = comparisonRules[propertyName] || ((a: any, b: any) => !_.isEqual(a, b));

    if (rule(originalValue, currentValue)) {
      if (!_.isObject(originalValue) || !_.isObject(currentValue) || 
          (Array.isArray(originalValue) && Array.isArray(currentValue) && originalValue.length !== currentValue.length)) {
        const changeLogItem: ChangeLogItem = {
          property: path,
          originalValue: safeToZero(originalValue),
          newValue: safeToZero(currentValue),
          timestamp: safeDateText(now.toISOString()), // Use safeDateText for consistent formatting
          action: getActionLabel(path, originalData, currentData),
          details: `__from__${JSON.stringify(safeToZero(originalValue), null, 2)}__to__${JSON.stringify(safeToZero(currentValue), null, 2)}`
        };
        changes.push(changeLogItem);
      }
    }

    if (_.isPlainObject(originalValue) && _.isPlainObject(currentValue)) {
      compareObjects(path, originalValue, currentValue);
    } else if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
      compareArrays(path, originalValue, currentValue);
    }
  }

  function compareObjects(basePath: string, originalObj: any, currentObj: any) {
    const allKeys = new Set([...Object.keys(originalObj), ...Object.keys(currentObj)]);

    for (const key of allKeys) {
      const newPath = basePath ? `${basePath}.${key}` : key;
      if (!_.isEqual(originalObj[key], currentObj[key])) {
        compareValues(newPath, originalObj[key], currentObj[key]);
      }
    }
  }

  function compareArrays(basePath: string, originalArr: any[], currentArr: any[]) {
    const maxLength = Math.max(originalArr.length, currentArr.length);

    for (let i = 0; i < maxLength; i++) {
      const newPath = `${basePath}[${i}]`;
      if (!_.isEqual(originalArr[i], currentArr[i])) {
        compareValues(newPath, originalArr[i], currentArr[i]);
      }
    }
  }

  function createChangeLogItem(path: string, originalValue: any, currentValue: any): ChangeLogItem {
    const action = getActionLabel(path, originalData, currentData);
    
    return {
      property: path,
      originalValue: safeToZero(originalValue),
      newValue: safeToZero(currentValue),
      timestamp: new Date().toISOString(), // Use ISO string for consistent formatting
      action,
      details: `__from__${JSON.stringify(originalValue)}__to__${JSON.stringify(currentValue)}`,
    };
  }

  compareObjects('', originalData, currentData);

  return changes;
}

function getActionLabel(propertyPath: string, oldDoc: DocumentDataType, newDoc: DocumentDataType): string {
  const parts = propertyPath.split('.');
  let label = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (propertyLabelMap[part]) {
      label += (label ? ' ' : '') + propertyLabelMap[part];
    } else if (part.match(/^\d+$/)) {
      // It's an array index, we'll use the name property if available
      const parentPart = parts[i - 1];
      if (parentPart === 'addedProducts') {
        const product = newDoc.data?.addedProducts?.[parseInt(part)];
        label += ` ${product?.name || `#${parseInt(part) + 1}`}`;
      } else if (parentPart === 'components') {
        const productIndex = parseInt(parts[i - 3]);
        const componentIndex = parseInt(part);
        const component = newDoc.data?.addedProducts?.[productIndex]?.components?.[componentIndex];
        label += ` ${component?.name || `#${componentIndex + 1}`}`;
      }
    }
  }

  return label || propertyPath;
}

export { generateChangeLogs, propertyLabelMap };
