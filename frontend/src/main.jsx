// Punto de entrada principal de la aplicación React
// Aquí se monta el árbol de componentes y se aplica el contexto de autenticación global.
// Se importan estilos globales y Bootstrap para el diseño visual.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Renderiza la aplicación dentro del elemento root, aplicando el contexto de autenticación
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
