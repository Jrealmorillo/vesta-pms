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
      case "empresa":
        endpoint = `/reservas/empresa/${termino}`;
        break;
      case "fecha":
        endpoint = `/reservas/entrada/${termino}`;
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
    <div className="container py-5 mt-4" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4">Buscar Reservas</h2>

      {/* Filtros de búsqueda: tipo y término */}
      <div className="row mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
          >
            <option value="apellido">Por Apellido</option>
            <option value="empresa">Por Empresa</option>
            <option value="fecha">Por Fecha de Entrada</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type={tipoBusqueda === "fecha" ? "date" : "text"}
            className="form-control"
            placeholder="Introduce el término..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") buscar();
            }}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={buscar}>
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla de resultados o mensaje si no hay resultados */}
      {resultados.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Huésped</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
                <th>Precio Total</th>
                <th>Habitación</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((res) => (
                <tr key={res.id_reserva}>
                  <td>{res.id_reserva}</td>
                  <td>
                    {res.primer_apellido_huesped} {res.segundo_apellido_huesped}{" "}
                    , {res.nombre_huesped}
                  </td>
                  <td>{res.fecha_entrada}</td>
                  <td>{res.fecha_salida}</td>
                  <td>
                    <span
                      className={`badge ${
                        res.estado === "Anulada"
                          ? "bg-danger"
                          : res.estado === "Confirmada"
                          ? "bg-success"
                          : res.estado === "Check-in"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {res.estado}
                    </span>
                  </td>
                  <td>{res.precio_total} €</td>
                  <td>{res.numero_habitacion || "-"}</td>
                  <td>
                    {/* Botón para navegar a la página de detalle de la reserva */}
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => navigate(`/reservas/${res.id_reserva}`)}
                    >
                      Ir a reserva
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No hay resultados aún.</p>
      )}
    </div>
  );
};

export default BuscarReservas;
