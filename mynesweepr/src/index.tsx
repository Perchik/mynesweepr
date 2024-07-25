import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./app/globalStyles";
import "@fontsource/manrope";
import "@fontsource/manrope/800.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
