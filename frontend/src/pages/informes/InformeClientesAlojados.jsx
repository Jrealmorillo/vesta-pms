// InformeClientesAlojados.jsx
// Vista para el informe de clientes alojados actualmente
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeClientesAlojados = () => {
  const [clientes, setClientes] = useState([]);
  const token = localStorage.getItem("token");

  // Consulta los clientes actualmente alojados
  const obtenerInforme = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/clientes-alojados`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientes(data);
      if (data.length === 0) {
        toast.info("No hay clientes alojados actualmente.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Clientes alojados actualmente</h2>
      <div className="row mb-4 pb-5 d-flex justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-lg btn-primary" onClick={obtenerInforme}>
            Consultar
          </button>
        </div>
      </div>
      {clientes.length > 0 && (
        <div className="table-responsive mt-5">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Reserva</th>
                <th>Habitación</th>
                <th>Nombre huésped</th>
                <th>Cliente</th>
                <th>Fecha entrada</th>
                <th>Fecha salida</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id_reserva}>
                  <td>{c.id_reserva}</td>
                  <td>{c.numero_habitacion}</td>
                  <td>{`${c.nombre_huesped} ${c.primer_apellido_huesped} ${c.segundo_apellido_huesped || ""}`}</td>
                  <td>{c.cliente ? `${c.cliente.nombre} ${c.cliente.primer_apellido}` : "—"}</td>
                  <td>{c.fecha_entrada}</td>
                  <td>{c.fecha_salida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InformeClientesAlojados;
