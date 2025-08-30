import _ from "lodash";

const propertyLabelMap = {
  dateOfSignature: "Date of Signature",
  note: "Note",
  discount: "Discount",
  "data.addedProducts.*.name": "${Name}'s Name",
  "data.addedProducts.*.description": "${Name}'s Description",
  "data.addedProducts.*.price": "${Name}'s Price",
  "data.addedProducts.*.discount": "${Name}'s Discount",
  "data.addedProducts.*.components.*.description":
    "${Component}'s Description in ${Product}",
  "data.addedProducts.*.components.*.price":
    "${Component}'s Price in ${Product}",
  "data.addedProducts.*.components.*.discount":
    "${Component}'s Discount in ${Product}",
  "data.addedProducts.*.components.*.discountedPrice":
    "${Component}'s Discounted Price in ${Product}",
  "data.addedProducts.*.discountedPrice": "${Name}'s Discounted Price",
  "data.addedProducts.*.components.*.included": "${Component}'s Inclusion in ${Product}", // Added path for component inclusion
};

function getNestedProperty(obj, propertyPath) {
  return propertyPath
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
      obj
    );
}

function findSpecificChanges(oldObj, newObj, propertyPath) {
  const changes = [];
  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    oldObj.forEach((item, index) => {
      const newItem = newObj[index];
      const currentPath = `${propertyPath}[${index}]`;
      if (!_.isEqual(item, newItem)) {
        changes.push(...findSpecificChanges(item, newItem, currentPath));
      }
    });
    if (newObj.length > oldObj.length) {
      for (let index = oldObj.length; index < newObj.length; index++) {
        changes.push({
          property: `${propertyPath}[${index}]`,
          previousValue: undefined,
          currentValue: newObj[index],
        });
      }
    }
  } else if (_.isObject(oldObj) && _.isObject(newObj)) {
    Object.keys({ ...oldObj, ...newObj }).forEach((key) => {
      const oldVal = oldObj[key] ?? null;
      const newVal = newObj[key] ?? null;
      const currentPath = `${propertyPath}.${key}`;
      if (!_.isEqual(oldVal, newVal)) {
        changes.push(...findSpecificChanges(oldVal, newVal, currentPath));
      }
    });
  } else if (!_.isEqual(oldObj ?? null, newObj ?? null)) {
    // Ignore changes from null to NaN or other falsy values
    if ((oldObj ?? null) || (newObj ?? null)) {
      changes.push({
        property: propertyPath,
        previousValue: oldObj ?? null,
        currentValue: newObj ?? null,
      });
    }
  }
  return changes;
}

function getActionLabel(propertyPath, oldDoc, newDoc) {
  if (propertyLabelMap[propertyPath]) {
    return propertyLabelMap[propertyPath];
  }

  const productMatch = propertyPath.match(
    /^data\.addedProducts\[(\d+)\]\.(.*)$/
  );
  if (productMatch) {
    const productIndex = parseInt(productMatch[1], 10);
    const productProperty = productMatch[2];
    const productName =
      newDoc.data.addedProducts?.[productIndex]?.name ||
      `Product ${productIndex + 1}`;

    if (productProperty === "discount" || productProperty === "discountedPrice") {
      return `${productName}'s ${productProperty === "discount" ? "Discount" : "Discounted Price"}`;
    }

    const componentMatch = productProperty.match(/^components\[(\d+)\]\.(.*)$/);
    if (componentMatch) {
      const componentIndex = parseInt(componentMatch[1], 10);
      const componentProperty = componentMatch[2];
      const componentName =
        newDoc.data.addedProducts?.[productIndex]?.components?.[componentIndex]
          ?.name || `Component ${componentIndex + 1}`;

      if (componentProperty === "discount" || componentProperty === "discountedPrice" || componentProperty === "included") {
        return `${componentName}'s ${componentProperty === "discount" ? "Discount" : componentProperty === "discountedPrice" ? "Discounted Price" : "Inclusion"} in ${productName}`;
      }

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

  return "Unknown Change";
}

export function generateChangeLogs(oldDoc, newDoc, now) {
  const changes = [];
  const propertiesToCheck = [
    "dateOfSignature",
    "note",
    "discount",
    "data.addedProducts",
    "data.addedProducts.*.discount",
    "data.addedProducts.*.components.*.discount",
    "data.addedProducts.*.components.*.included" // Ensure we check for inclusion changes
  ];

  propertiesToCheck.forEach((property) => {
    const oldValue = _.cloneDeep(getNestedProperty(oldDoc, property)) ?? null;
    const newValue = _.cloneDeep(getNestedProperty(newDoc, property)) ?? null;

    const specificChanges = findSpecificChanges(
      oldValue,
      newValue,
      property
    );

    if (specificChanges.length > 0) changes.push(...specificChanges);
  });

  return changes.map((change) => ({
    name: getActionLabel(change.property, oldDoc, newDoc),
    description: `from ${JSON.stringify(
      change.previousValue,
      null,
      2
    )} to ${JSON.stringify(change.currentValue, null, 2)}`,
  }));
}
