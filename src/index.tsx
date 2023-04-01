import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const doc = document.getElementById('root')!

const root = createRoot(doc);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);