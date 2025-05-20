// Página para buscar facturas en el sistema
// Permite filtrar por ID de factura, ID de reserva o fecha de emisión y muestra los resultados en una tabla.
// Incluye validaciones, notificaciones y acceso a la visualización de cada factura.

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuscarFacturas = () => {
  const [filtros, setFiltros] = useState({
    id_factura: "",
    id_reserva: "",
    fecha_emision: "",
  });

  const [resultados, setResultados] = useState([]); // Resultados de la búsqueda
  const token = localStorage.getItem("token"); // Token de autenticación
  const navigate = useNavigate();

  // Actualiza los filtros según el input del usuario
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Realiza la búsqueda de facturas según los filtros
  const buscarFacturas = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/facturas/buscar`,
        {
          params: filtros,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(filtros); // Muestra los filtros en la consola para depuración
      setResultados(data);
      if (data.length === 0) {
        toast.info("No se encontraron facturas con esos criterios.");
      }
    } catch (error) {
      toast.error("Error al buscar facturas");
    }
  };

  return (
    <div className="container py-5 mt-4">
      <h2>Buscar Facturas</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label htmlFor="id_factura">ID Factura</label>
          <input
            type="number"
            name="id_factura"
            className="form-control"
            value={filtros.id_factura}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="id_reserva">ID Reserva</label>
          <input
            type="number"
            name="id_reserva"
            className="form-control"
            value={filtros.id_reserva}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="fecha_emision">Fecha emisión</label>
          <input
            type="date"
            name="fecha_emision"
            className="form-control"
            value={filtros.fecha_emision}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3 d-grid align-items-end">
          <button className="btn btn-primary" onClick={buscarFacturas}>
            Buscar
          </button>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Reserva</th>
                <th>Huésped</th>
                <th>Total (€)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((factura) => (
                <tr key={factura.id_factura}>
                  <td>{factura.id_factura}</td>
                  <td>
                    {new Date(factura["fecha_emision"]).toLocaleDateString(
                      "es-ES"
                    )}
                  </td>
                  <td>{factura.id_reserva}</td>
                  <td>
                    {factura.cliente
                      ? `${factura.cliente.nombre} ${
                          factura.cliente.primer_apellido ?? ""
                        } ${factura.cliente.segundo_apellido ?? ""}`
                      : "—"}
                  </td>
                  <td>{parseFloat(factura.total).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        factura.estado === "Pagada"
                          ? "bg-success"
                          : factura.estado === "Pendiente"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/facturas/${factura.id_factura}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuscarFacturas;
