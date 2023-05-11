import "dotenv/config";
import { createRoot } from "react-dom/client";
import "./css/styles.css";
import App from "./App";

const doc = document.getElementById("root");
if (!doc) throw new Error("Failed to find root element");

const root = createRoot(doc);

root.render(<App />);
