// Página para buscar reservas por apellido, empresa o fecha de entrada.
// Permite filtrar reservas y muestra los resultados en una tabla ordenada por apellido del huésped.
// Incluye feedback visual y navegación a la reserva seleccionada.

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BuscarReservas = () => {
  const { token } = useContext(AuthContext);
  // tipoBusqueda: criterio de búsqueda (apellido, empresa, fecha)
  // termino: valor introducido por el usuario
  // resultados: array de reservas encontradas
  const [tipoBusqueda, setTipoBusqueda] = useState("apellido");
  const [termino, setTermino] = useState("");
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  // Realiza la búsqueda según el tipo y término introducido
  const buscar = async () => {
    if (!termino.trim()) {
      toast.warning("Introduce un término de búsqueda");
      return;
    }

    let endpoint = "";

    // Selecciona el endpoint según el tipo de búsqueda
    switch (tipoBusqueda) {
      case "apellido":
        endpoint = `/reservas/apellido/${termino}`;
        break;
      case "fecha":
        endpoint = `/reservas/entrada/${termino}`;
        break;
      case "id":
        endpoint = `/reservas/id/${termino}`;
        break;
      default:
        return;
    }

    try {
      // Solicita reservas filtradas a la API
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Si no se encuentran reservas, muestra un mensaje
      if (response.data.length === 0) {
        toast.warning("No se encontraron reservas con ese criterio.");
        setResultados([]);
        return;
      }
      // Si la búsqueda es por id, la API devuelve un solo objeto o error
      if (tipoBusqueda === "id") {
        if (!response.data || response.data.id_reserva === undefined) {
          toast.warning("No se encontró ninguna reserva con ese número.");
          setResultados([]);
          return;
        }
        setResultados([response.data]);
        return;
      }
      // Ordena los resultados por primer apellido del huésped
      const reservasOrdenadasPorApellido = response.data.sort((a, b) => {
        const apellidoA = a.primer_apellido_huesped.toLowerCase();
        const apellidoB = b.primer_apellido_huesped.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      });
      setResultados(reservasOrdenadasPorApellido);
    } catch (error) {
      // Muestra error amigable si la búsqueda falla
      toast.error(
        `Error al buscar reservas: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "1200px" }}>
      {/* Header con información principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-2 text-dark">Buscar Reservas</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Filtros de búsqueda */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                Criterios de búsqueda
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">
                    Buscar por:
                  </label>
                  <select
                    className="form-select"
                    value={tipoBusqueda}
                    onChange={(e) => setTipoBusqueda(e.target.value)}
                  >
                    <option value="apellido">Por Apellido</option>
                    <option value="fecha">Por Fecha de Entrada</option>
                    <option value="id">Por Nº Reserva</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">
                    Término de búsqueda:
                  </label>
                  <input
                    type={tipoBusqueda === "fecha" ? "date" : "text"}
                    className="form-control"
                    placeholder={
                      tipoBusqueda === "id"
                        ? "Introduce el número de reserva..."
                        : "Introduce el apellido..."
                    }
                    value={termino}
                    onChange={(e) => setTermino(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") buscar();
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">
                    &nbsp;
                  </label>
                  <button
                    className="btn btn-primary w-100 d-block"
                    onClick={buscar}
                    style={{ borderRadius: "8px" }}
                  >
                    Buscar reservas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Resultados de búsqueda */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                Resultados de búsqueda
                {resultados.length > 0 && (
                  <span className="badge bg-primary ms-2">
                    {resultados.length}
                  </span>
                )}
              </h5>
            </div>
            {resultados.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold text-muted">ID</th>
                      <th className="fw-semibold text-muted">Huésped</th>
                      <th className="fw-semibold text-muted">Entrada</th>
                      <th className="fw-semibold text-muted">Salida</th>
                      <th className="fw-semibold text-muted">Estado</th>
                      <th className="fw-semibold text-muted text-end">
                        Precio Total
                      </th>
                      <th className="fw-semibold text-muted text-center">
                        Habitación
                      </th>
                      <th className="fw-semibold text-muted text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((res) => (
                      <tr key={res.id_reserva} className="align-middle">
                        <td className="fw-medium">#{res.id_reserva}</td>
                        <td>
                          <div className="fw-medium">
                            {res.primer_apellido_huesped}{" "}
                            {res.segundo_apellido_huesped}
                          </div>
                          <small className="text-muted">
                            {res.nombre_huesped}
                          </small>
                        </td>
                        <td>
                          {new Date(res.fecha_entrada).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>
                          {new Date(res.fecha_salida).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              res.estado === "Anulada"
                                ? "bg-danger"
                                : res.estado === "Confirmada"
                                ? "bg-success"
                                : res.estado === "Check-in"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                            style={{ borderRadius: "12px" }}
                          >
                            {res.estado}
                          </span>
                        </td>
                        <td className="text-end fw-semibold">
                          {res.precio_total} €
                        </td>
                        <td className="text-center">
                          {res.numero_habitacion ? (
                            <span className="badge bg-light text-dark">
                              {res.numero_habitacion}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() =>
                              navigate(`/reservas/${res.id_reserva}`)
                            }
                            style={{ borderRadius: "15px" }}
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card-body p-5 text-center">
                <div className="text-muted mb-3">
                  <svg
                    width="64"
                    height="64"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>
                <h6 className="text-muted mb-2">Sin resultados</h6>
                <p className="text-muted mb-0">
                  Introduce un criterio de búsqueda para encontrar reservas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscarReservas;
