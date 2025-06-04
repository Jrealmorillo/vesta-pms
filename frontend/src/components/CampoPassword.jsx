// Componente reutilizable para campos de contraseña con opción de mostrar/ocultar
// Permite alternar la visibilidad de la contraseña mediante un botón con icono de ojo
// Recibe props para etiqueta, nombre, valor y manejador de cambio

import { useState } from "react";

const CampoPassword = ({ label, name, value, onChange }) => {
  const [mostrar, setMostrar] = useState(false); // Estado para alternar visibilidad

  return (
    <div className="mb-3 position-relative">
      <label className="form-label">{label}</label>
      <input
        type={mostrar ? "text" : "password"} // Alterna entre texto y contraseña
        name={name}
        className="form-control outline-secondary"
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setMostrar(!mostrar)} // Cambia el estado de visibilidad
        className="btn btn-sm btn-light position-absolute"
        style={{ top: "34px", right: "10px", padding: "0.25rem 0.5rem" }}
      >
        {/* Icono de ojo abierto/cerrado según el estado */}
        <i className={`bi ${mostrar ? "bi-eye-slash" : "bi-eye"}`}></i>
      </button>
    </div>
  );
};

export default CampoPassword;
