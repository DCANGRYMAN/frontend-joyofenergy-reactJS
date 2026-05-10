import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./components/App.jsx";
import { DataProvider } from "./hooks/useCurrentDataContext";

const renderRoot = ReactDOM.createRoot(document.getElementById("root"));

renderRoot.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);