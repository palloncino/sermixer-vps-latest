import _ from "lodash";

// Define the propertyLabelMap here
const propertyLabelMap = {
  "clientSignature": "Client Signature",
  "ownerSignature": "Owner Signature",
  "status": "Status",
  "followUpSent": "Follow Up Sent",
  "readonly": "Read-Only Status",
  "note": "Note",
  "dateOfSignature": "Date of signature",
  "data.uploadedFiles": "Uploaded Files",
  "data.addedProducts.*.name": "${Name}'s Name",
  "data.addedProducts.*.description": "${Name}'s Description",
  "data.addedProducts.*.price": "${Name}'s Price",
  "data.addedProducts.*.components.*.description": "${Component}'s Description in ${Product}",
  "data.addedProducts.*.components.*.price": "${Component}'s Price in ${Product}",
  "data.addedProducts.*.components.*.included": "${Component}'s Inclusion in ${Product}"
};

export function generateChangeLogs(oldDoc, newDoc, now) {
  const changes = [];
  const propertiesToCheck = [
    "data.quoteHeadDetails",
    "data.selectedClient",
    "data.addedProducts",
    "clientSignature",
    "ownerSignature",
    "status",
    "followUpSent",
    "readonly",
    "note",
    "dateOfSignature",
    "uploadedFiles",
    "discount"
  ];

  propertiesToCheck.forEach(property => {
    const oldValue = getNestedProperty(oldDoc, property) || [];
    const newValue = getNestedProperty(newDoc, property) || [];

    const specificChanges = findSpecificChanges(oldValue, newValue, property);
    if (specificChanges.length > 0) changes.push(...specificChanges);
  });

  return changes.map(change => ({
    action: getActionLabel(change.property, oldDoc, newDoc),
    timestamp: now.toISOString(),
    details: `__from__${JSON.stringify(change.previousValue, null, 2)}__to__${JSON.stringify(change.currentValue, null, 2)}`
  }));
}

function getNestedProperty(obj, propertyPath) {
  return propertyPath.split(".").reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
}

function findSpecificChanges(oldObj, newObj, propertyPath) {
  const changes = [];

  if (_.isArray(newObj) && !_.isArray(oldObj)) {
    // Handle case when newObj is an array and oldObj is missing or different type
    newObj.forEach((newItem, index) => {
      const currentPath = `${propertyPath}.${index}`;
      changes.push({
        property: currentPath,
        previousValue: "Not present",
        currentValue: newItem,
      });
    });
  } else if (_.isObject(oldObj) && _.isObject(newObj)) {
    // Recursive comparison for objects
    const allKeys = _.union(Object.keys(oldObj), Object.keys(newObj));
    allKeys.forEach((key) => {
      const oldVal = oldObj[key];
      const newVal = newObj[key];
      const currentPath = `${propertyPath}.${key}`;

      if (!_.isEqual(oldVal, newVal)) {
        if (_.isObject(oldVal) && _.isObject(newVal)) {
          changes.push(...findSpecificChanges(oldVal, newVal, currentPath));
        } else {
          // If both are falsy (e.g., undefined, null, empty), treat it as no change
          if (isFalsy(oldVal) && isFalsy(newVal)) return;
          changes.push({ property: currentPath, previousValue: oldVal, currentValue: newVal });
        }
      }
    });
  } else if (!_.isEqual(oldObj, newObj)) {
    // Simple comparison for non-objects
    if (isFalsy(oldObj) && isFalsy(newObj)) return;
    changes.push({ property: propertyPath, previousValue: oldObj, currentValue: newObj });
  }

  return changes;
}


function isFalsy(value) {
  return value === null || value === undefined || value === '';
}

function getActionLabel(propertyPath, oldDoc, newDoc) {
  // Check for direct mapping
  if (propertyLabelMap[propertyPath]) {
    return propertyLabelMap[propertyPath];
  }

  // Handle status array indices
  const statusMatch = propertyPath.match(/^status\.(\d+)\.value$/);
  if (statusMatch) {
    const statusIndex = parseInt(statusMatch[1], 10);
    const statusName =
      newDoc.status[statusIndex]?.name || `Status ${statusIndex}`;
    return `Status - ${statusName}`;
  }

  // Handle dynamic parts like product names and component names
  const productMatch = propertyPath.match(/^data\.addedProducts\.(\d+)\.(.*)$/);
  if (productMatch) {
    const productIndex = parseInt(productMatch[1], 10);
    const productProperty = productMatch[2];
    const productName =
      newDoc.data.addedProducts?.[productIndex]?.name ||
      `Product ${productIndex + 1}`;

    const componentMatch = productProperty.match(/^components\.(\d+)\.(.*)$/);
    if (componentMatch) {
      const componentIndex = parseInt(componentMatch[1], 10);
      const componentProperty = componentMatch[2];
      const componentName =
        newDoc.data.addedProducts?.[productIndex]?.components?.[componentIndex]
          ?.name || `Component ${componentIndex + 1}`;

      const dynamicComponentProperty = `data.addedProducts.*.components.*.${componentProperty}`;
      if (propertyLabelMap[dynamicComponentProperty]) {
        return propertyLabelMap[dynamicComponentProperty]
          .replace("${Component}", componentName)
          .replace("${Product}", productName);
      }
    }

    const dynamicProperty = `data.addedProducts.*.${productProperty}`;
    if (propertyLabelMap[dynamicProperty]) {
      return propertyLabelMap[dynamicProperty].replace("${Name}", productName);
    }
  }

  // Fallback to the original property path
  return propertyPath;
}
