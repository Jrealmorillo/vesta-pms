// Página para editar los datos de una empresa 
// Permite cargar los datos actuales, modificarlos y guardarlos mediante un formulario controlado.
// Incluye validaciones, notificaciones y navegación tras la edición.

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const EditarEmpresa = () => {
  // Obtiene el ID de la empresa desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [empresa, setEmpresa] = useState(null); // Estado de la empresa a editar

  useEffect(() => {
    // Carga los datos de la empresa al montar el componente
    const obtenerEmpresa = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/empresas/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmpresa(Array.isArray(res.data) ? res.data[0] : res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Error al cargar los datos de la empresa");
        navigate("/empresas/buscar");
      }
    };

    obtenerEmpresa();
  }, [id, token, navigate]);

  // Maneja los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  // Envía el formulario para actualizar la empresa
  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Evitar envío de email vacío (lo convierte en null)
    if (empresa.email?.trim() === "") {
      empresa.email = null;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/empresas/${id}`,
        empresa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Empresa ${empresa.nombre} actualizada correctamente`);
      navigate("/empresas/buscar");
    } catch (error) {
      toast.error(`Error al actualizar empresa: ${error.response?.data?.error || error.message}`);
    }
  };
  // Muestra un mensaje mientras se cargan los datos
  if (!empresa) return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando datos de la empresa...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-building-gear text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Editar Empresa</h4>
                  <small className="text-muted">Modificar datos de la empresa #{id}</small>
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
                  <div className="col-md-9 mb-3">
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

                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">CIF *</label>
                    <input
                      type="text"
                      name="cif"
                      className="form-control rounded"
                      placeholder="CIF"
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
                    value={empresa.direccion || ""}
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
                      value={empresa.ciudad || ""}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">País</label>
                    <input
                      type="text"
                      name="pais"
                      className="form-control rounded"
                      placeholder="País"
                      value={empresa.pais}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">Código postal</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      className="form-control rounded"
                      placeholder="CP"
                      value={empresa.codigo_postal || ""}
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
                      value={empresa.telefono || ""}
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
                      value={empresa.email || ""}
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
                        checked={empresa.credito}
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
                    value={empresa.observaciones || ""}
                    onChange={manejarCambio}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="row g-3">
              <div className="col-md-6">
                <button type="submit" className="btn btn-success btn-lg w-100 rounded">
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Cambios
                </button>
              </div>
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-100 rounded"
                  onClick={() => {
                    navigate("/empresas/buscar");
                    toast.info(`Edición de ${empresa.nombre} cancelada`);
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarEmpresa;
