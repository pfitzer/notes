import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Editor, { loader } from "./Editor.jsx";
import { DatabaseProvider } from "./contexts/DatabaseContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/editor/:noteID",
    element: <Editor />,
    loader: loader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DatabaseProvider>
      <RouterProvider router={router} />
    </DatabaseProvider>
  </React.StrictMode>
);