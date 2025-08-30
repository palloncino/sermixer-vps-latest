import i18n from '../i18n';

// Define the function with TypeScript annotations
export function dateText(dateStr: string, type: "long" | "short" | "short_time" | 'hours' = "long"): string {
  if (!dateStr || typeof dateStr !== 'string') {
    console.error('Invalid date input:', dateStr);
    return ''; // Return an empty string or a default value
  }

  const date = new Date(dateStr);
  const locale = i18n.language; // Fetching the current language set in i18n

  // Define options for Intl.DateTimeFormat
  const optionsLong: Intl.DateTimeFormatOptions = {
    month: "long", // "March" or "Marzo"
    day: "2-digit", // "27"
    year: "numeric", // "2024"
    hour: "2-digit", // "23" (for 11 PM)
    minute: "2-digit", // "52"
    hourCycle: 'h23', // Use 24-hour cycle
  };

  const optionsShort: Intl.DateTimeFormatOptions = {
    month: "short", // "Mar" or "Mar."
    day: "2-digit", // "27"
    year: "numeric", // "2024"
  };

  const optionsShortTime: Intl.DateTimeFormatOptions = {
    month: "short", // "Sep"
    day: "numeric", // "12"
    hour: "2-digit", // "12"
    minute: "2-digit", // "45"
    hourCycle: 'h23', // Use 24-hour cycle
  };

  let options: Intl.DateTimeFormatOptions;
  switch (type) {
    case "long":
      options = optionsLong;
      break;
    case "short":
      options = optionsShort;
      break;
    case "short_time":
      options = optionsShortTime;
      break;
    case "hours":
      const hours = date.getHours();
      const minutes = date.getMinutes();
      // Return hours without leading zero for single digits, and minutes with leading zero if necessary
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    default:
      options = optionsLong;
  }

  let readable = new Intl.DateTimeFormat(locale, options).format(date);

  if (type === "short_time") {
    const [datePart, timePart] = readable.split(', ');
    readable = `${datePart}, ${timePart}`;
  }

  return readable; // Outputs based on type, e.g., "March 27, 2024, 23:52" or "12 Sep, 12:45"
}
