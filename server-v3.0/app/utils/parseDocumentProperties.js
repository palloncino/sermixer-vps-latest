import Logger from "../utils/Logger.js";

export function parseJSONIfNeeded(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch (error) {
    Logger.error(`Failed to parse JSON: ${error}`);
    return value;
  }
}

export function parseDocumentProperties(document) {
  try {
    document = parseJSONIfNeeded(document);
    document.status = parseJSONIfNeeded(document.status);
    document.revisions = parseJSONIfNeeded(document.revisions);
    document.pdfUrls = parseJSONIfNeeded(document.pdfUrls);
    document.data = parseJSONIfNeeded(document.data);
    return document;
  } catch (error) {
    Logger.error(`Failed to parse document properties: ${error}`);
    return document;
  }
}
