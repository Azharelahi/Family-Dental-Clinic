import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/**
 * main.jsx — Application entry point
 * Mounts the React app into #root defined in index.html.
 * Compatible with Electron's renderer process.
 */

// Global base reset (minimal — keeps Electron window clean)
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #F0F4F8;
    -webkit-font-smoothing: antialiased;
  }
  /* Scrollbar styling for Electron */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #F0F4F8;
  }
  ::-webkit-scrollbar-thumb {
    background: #B0BEC5;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #78909C;
  }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);