// Página para registrar una nueva empresa en Vesta PMS (Frontend)
// Permite ingresar los datos de la empresa y enviarlos al backend para su registro.
// Incluye validaciones, notificaciones y reseteo del formulario tras el registro exitoso.

import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const NuevaEmpresa = () => {
  const { token } = useContext(AuthContext);

  const [empresa, setEmpresa] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigo_postal: "",
    telefono: "",
    email: "",
    credito: false,
    observaciones: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // campo email debe ser null en vez de "" para evitar problemas en el backend
    if (empresa.email === "") {
      empresa.email = null;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/empresas/registro`,
        empresa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Empresa registrado correctamente");
      // Resetea el formulario tras registrar
      setEmpresa({
        nombre: "",
        cif: "",
        direccion: "",
        ciudad: "",
        pais: "",
        codigo_postal: "",
        telefono: "",
        email: "",
        credito: "",
        observaciones: "",
      });
    } catch (error) {
      const mensaje =
        error.response?.data?.detalle || "Error al registrar empresa";
      toast.error(mensaje);
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-4 mt-4">
      <h2 className="text-center mb-4">Registrar nueva empresa</h2>
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "750px", textAlign: "left" }}
      >
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={empresa.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">CIF</label>
            <input
              type="text"
              name="cif"
              className="form-control"
              value={empresa.cif}
              onChange={manejarCambio}
              required
            />
          </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              value={empresa.direccion}
              onChange={manejarCambio}
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                className="form-control"
                value={empresa.ciudad}
                onChange={manejarCambio}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">País</label>
              <input
                type="text"
                name="pais"
                className="form-control"
                value={empresa.pais}
                onChange={manejarCambio}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Código postal</label>
              <input
                type="text"
                name="codigo_postal"
                className="form-control"
                value={empresa.codigo_postal}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={empresa.telefono}
                onChange={manejarCambio}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={empresa.email}
                onChange={manejarCambio}
              />
            </div>
          </div>
          <div className="col-6 form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              name="credito"
              id="creditoCheck"
              onChange={(e) =>
                setEmpresa({ ...empresa, credito: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="creditoCheck">
              Empresa con crédito
            </label>
          </div>

          <div className="mb-4">
            <label className="form-label">Observaciones</label>
            <textarea
              name="observaciones"
              className="form-control"
              rows="3"
              value={empresa.observaciones}
              onChange={manejarCambio}
            ></textarea>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Registrar empresa
            </button>
          </div>
        
      </form>
    </div>
  );
}

export default NuevaEmpresa;
