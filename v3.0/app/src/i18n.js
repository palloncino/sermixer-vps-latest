// src/i18n.js
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Ensure this is imported correctly
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpBackend) // Optionally use a backend to load translation files
  .use(LanguageDetector) // Use the language detector
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    lng: 'it', // Set Italian as the default language
    fallbackLng: 'it', // Italian as fallback too
    debug: false, // Set to true to see logs in the console

    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },

    // Define the backend loader options if you're using 'i18next-http-backend'
    backend: {
      loadPath: '/v3.0/locales/{{lng}}.v1.json?v=1756547372', // Path to the locales
    },

    detection: {
      // Configuration options for the language detector - prioritize Italian
      order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'navigator', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'], // Cache the detected language in localStorage and cookies
    },
  });

export default i18n;
