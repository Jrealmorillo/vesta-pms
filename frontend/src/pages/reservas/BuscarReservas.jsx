import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BuscarReservas = () => {
  const { token } = useContext(AuthContext);
  const [tipoBusqueda, setTipoBusqueda] = useState("apellido");
  const [termino, setTermino] = useState("");
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  const buscar = async () => {
    if (!termino.trim()) {
      toast.warning("Introduce un término de búsqueda");
      return;
    }

    let endpoint = "";

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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultados(response.data);
    } catch (error) {
      const msg = error.response?.data?.error || "Error al buscar reservas";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-5 mt-4"
    style={{ maxWidth: "900px" }}>
      <h2 className="mb-4">Buscar Reservas</h2>

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
                    {res.nombre_huesped} {res.primer_apellido_huesped}
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
}

export default BuscarReservas;
