// IMPORT REACT LIBRARIES
import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
// IMPORT COMPONENTS
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
   <>
      <ToastContainer />
      <React.StrictMode>
         <App />
      </React.StrictMode>
   </>
);
