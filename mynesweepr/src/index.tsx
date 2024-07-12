import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";
import App from "./App";
import "./globalStyles";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
