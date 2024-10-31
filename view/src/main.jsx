import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { loadConfig } from "./Config.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

loadConfig().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
