import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "jquery/dist/jquery.js";
import "jquery/dist/jquery.slim.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "jquery/dist/jquery.js";
import "jquery/dist/jquery.slim.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Sass/_global.scss";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
