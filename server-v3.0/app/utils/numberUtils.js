export const toNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };
  
  export const calculateDiscountedPrice = (price, discount) => {
    const numPrice = toNumber(price);
    const numDiscount = toNumber(discount);
    return Number((numPrice * (1 - numDiscount / 100)).toFixed(2));
  };