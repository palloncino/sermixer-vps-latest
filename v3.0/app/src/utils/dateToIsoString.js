export const formatDateToISOString = (input) => {
    // Check if the input is already in the ISO format YYYY-MM-DD
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoRegex.test(input)) {
      return input;
    }
  
    // If the input is not in ISO format, parse it to get the correct format
    const date = new Date(input);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  };
  