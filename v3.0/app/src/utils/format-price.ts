// src/utils/formatPrice.ts

export const formatPrice = (price: number | string): string => {
  const priceNum = Number(price);
  const formatted = priceNum
    .toFixed(2)  // Ensure two decimal places
    .replace('.', ',')  // Replace decimal point with comma
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");  // Add periods for thousands
  
  return `€${formatted}`;  // Add Euro symbol
};

// CSS-in-JS styles for clear price display
export const priceStyles = {
  fontFamily: '"Open Sans", "Roboto", "Lato", sans-serif',
  letterSpacing: '0.3px',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 500
};
