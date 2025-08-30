export function safelyParseJSON(jsonString) {
  try {
    var parsed = JSON.parse(jsonString);
    // Check if it was double-encoded
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return parsed;
  } catch (e) {
    console.error(`Failed to parse JSON: ${e}`);
    return {};
  }
}
