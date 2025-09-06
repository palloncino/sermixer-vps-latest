import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals";

// ===== V3 ENVIRONMENT DETECTION =====
const isDevelopment = process.env.NODE_ENV === 'development';
console.log("🔥 V3 Mode:", isDevelopment ? "DEVELOPMENT SERVER" : "PRODUCTION BUILD");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
