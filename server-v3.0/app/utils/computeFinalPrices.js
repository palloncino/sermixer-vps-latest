import { toNumber, calculateDiscountedPrice } from './numberUtils.js';

export function computeFinalPrices(addedProducts, rootDiscount = 0) {
  const result = addedProducts.reduce((acc, product) => {
    const basePrice = toNumber(product.price);
    const basePriceDiscounted = calculateDiscountedPrice(basePrice, product.discount);

    acc.TOTAL_BASE_PRICE += basePrice;
    acc.TOTAL_BASE_PRICE_DISCOUNTED += basePriceDiscounted;

    const componentTotals = product.components.reduce((compAcc, component) => {
      // Only include the component if it is included
      if (component.included !== false) {
        const componentPrice = toNumber(component.price);
        const componentQuantity = component.quantity || 1; // Default to 1 if quantity is not provided
        const componentPriceDiscounted = calculateDiscountedPrice(componentPrice, component.discount);

        // Calculate total for this component based on quantity
        compAcc.total += componentPrice * componentQuantity;
        compAcc.discounted += componentPriceDiscounted * componentQuantity;

        acc.ALL_PRICE_RECORDS.push({
          name: component.name,
          originalPrice: componentPrice,
          discountedPrice: componentPriceDiscounted,
          discount: toNumber(component.discount),
          quantity: componentQuantity, // Include quantity in the record
        });

        component.discountedPrice = componentPriceDiscounted;
      }

      return compAcc;
    }, { total: 0, discounted: 0 });

    acc.TOTAL_ACCESSORIES += componentTotals.total;
    acc.TOTAL_ACCESSORIES_DISCOUNTED += componentTotals.discounted;

    acc.ALL_PRICE_RECORDS.push({
      name: product.name,
      originalPrice: basePrice,
      discountedPrice: basePriceDiscounted,
      discount: toNumber(product.discount),
      components: componentTotals.total,
      componentsDiscounted: componentTotals.discounted,
    });

    product.discountedPrice = basePriceDiscounted;

    return acc;
  }, {
    TOTAL_BASE_PRICE: 0,
    TOTAL_ACCESSORIES: 0,
    TOTAL_BASE_PRICE_DISCOUNTED: 0,
    TOTAL_ACCESSORIES_DISCOUNTED: 0,
    ALL_PRICE_RECORDS: [],
  });

  const TOTAL_ALL = result.TOTAL_BASE_PRICE + result.TOTAL_ACCESSORIES;
  const TOTAL_ALL_DISCOUNTED = result.TOTAL_BASE_PRICE_DISCOUNTED + result.TOTAL_ACCESSORIES_DISCOUNTED;
  const TOTAL_WITH_DISCOUNT = Math.max(TOTAL_ALL_DISCOUNTED - toNumber(rootDiscount), 0);
  const TOTAL_ALL_WITH_TAXES = applyTaxes(TOTAL_WITH_DISCOUNT, 0.22);

  return {
    ...result,
    TOTAL_ALL,
    TOTAL_ALL_DISCOUNTED,
    TOTAL_WITH_DISCOUNT,
    TOTAL_ALL_WITH_TAXES,
  };
}

function applyTaxes(amount, taxRate) {
  return amount * (1 + taxRate);
}
