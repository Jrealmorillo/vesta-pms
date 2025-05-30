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
      toast.success(`Empresa ${empresa.nombre} registrada correctamente`);
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
        credito: false,
        observaciones: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.detalle || error.message);
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-building-add text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Registrar Nueva Empresa</h4>
                  <small className="text-muted">Crear un nuevo registro de empresa en el sistema</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form onSubmit={manejarSubmit}>
            {/* Card: Datos de la empresa */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-building me-2 text-primary"></i>
                  Datos de la Empresa
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label text-muted fw-medium">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control rounded"
                      placeholder="Nombre de la empresa"
                      value={empresa.nombre}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">CIF *</label>
                    <input
                      type="text"
                      name="cif"
                      className="form-control rounded"
                      placeholder="CIF de la empresa"
                      value={empresa.cif}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-medium">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control rounded"
                    placeholder="Dirección completa"
                    value={empresa.direccion}
                    onChange={manejarCambio}
                  />
                </div>                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      className="form-control rounded"
                      placeholder="Ciudad"
                      value={empresa.ciudad}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">País *</label>
                    <input
                      type="text"
                      name="pais"
                      className="form-control rounded"
                      placeholder="País"
                      value={empresa.pais}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">Código postal</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      className="form-control rounded"
                      placeholder="CP"
                      value={empresa.codigo_postal}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control rounded"
                      placeholder="Número de teléfono"
                      value={empresa.telefono}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded"
                      placeholder="correo@ejemplo.com"
                      value={empresa.email}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="credito"
                        id="creditoCheck"
                        onChange={(e) =>
                          setEmpresa({ ...empresa, credito: e.target.checked })
                        }
                      />
                      <label className="form-check-label fw-medium" htmlFor="creditoCheck">
                        Empresa con crédito
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label text-muted fw-medium">Observaciones</label>
                  <textarea
                    name="observaciones"
                    className="form-control rounded"
                    rows="3"
                    placeholder="Observaciones adicionales sobre la empresa..."
                    value={empresa.observaciones}
                    onChange={manejarCambio}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botón de registro */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg rounded">
                <i className="bi bi-building-add me-2"></i>
                Registrar Empresa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevaEmpresa;
