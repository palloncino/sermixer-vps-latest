export function calculatePriceSummary(
  documentData: DocumentDataType,
  taxRate: number = 0.22,
  netDiscountOnTotal: number = 0
) {
  const calculateProductDetails = (products: ProductType[]): ProductDetail[] => {
    return products.map((product) => {
      const basePrice = parseFloat(product.price?.toString() ?? "0") || 0;
      const productDiscount = product.discount ?? 0;
      const productDiscountAmount = (basePrice * productDiscount) / 100;
      const discountedProductPrice = basePrice - productDiscountAmount;

      // Filter out components that are not included
      const includedComponents = product.components
        ?.filter((component) => component.included) // Only include components where included === true
        .map((component) => {
          const componentBasePrice = parseFloat(component.price?.toString() ?? "0") || 0;
          const componentDiscount = component.discount ?? 0;
          const componentDiscountAmount = (componentBasePrice * componentDiscount) / 100;
          const discountedComponentPrice = componentBasePrice - componentDiscountAmount;

          return {
            name: component.name,
            price: discountedComponentPrice, // Apply the discount to the component price
            quantity: component.quantity,
          };
        }) ?? [];

      // Calculate components total considering quantity and discount
      const componentsTotal = includedComponents.reduce(
        (total, component) => total + component.price * component.quantity,
        0
      );

      const total = discountedProductPrice + componentsTotal;

      return {
        name: product.name,
        basePrice,
        discount: productDiscount,
        discountAmount: productDiscountAmount,
        components: includedComponents, // Return only included components with discounted prices
        total,
      };
    });
  };

  const productDetails = calculateProductDetails(
    documentData?.data?.addedProducts ?? []
  );
  const subtotal = productDetails.reduce(
    (total, product) => total + product.total,
    0
  );
  const discountAmount = netDiscountOnTotal;
  const subtotalAfterDiscount = Math.max(subtotal - discountAmount, 0);
  const taxAmount = subtotalAfterDiscount * taxRate;
  const totalAfterDiscount = subtotalAfterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    totalAfterDiscount,
    productDetails,
  };
}
