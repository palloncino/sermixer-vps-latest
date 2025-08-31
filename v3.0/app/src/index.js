import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals";

console.log("🚀 V3 App starting...");
console.log("Root element:", document.getElementById("root"));

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("React root created:", root);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ V3 App rendered");
reportWebVitals();
