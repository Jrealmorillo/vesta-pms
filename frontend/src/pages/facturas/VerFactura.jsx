// Página para visualizar el detalle de una factura
// Muestra la cabecera, datos del cliente y los cargos asociados a la factura.
// Incluye carga asíncrona, manejo de errores y cálculo del total.

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerFactura = () => {
  const { id } = useParams(); // Obtiene el ID de la factura desde la URL
  const [factura, setFactura] = useState(null); // Estado de la factura
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Carga la factura al montar el componente
  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/facturas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFactura(data);
      } catch (error) {
        toast.error("Error al cargar la factura");
      }
    };
    cargarFactura();
  }, [id]);

  // Muestra mensaje mientras se carga la factura
  if (!factura)
    return <div className="container py-5">Cargando factura...</div>;

  // Calcula el total sumando los cargos
  const total = factura.detalles
    ?.reduce((sum, d) => sum + parseFloat(d.total || 0), 0)
    .toFixed(2);

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2>Factura #{factura.id_factura}</h2>

      {/* Cabecera de la factura */}
      <div className="card mb-4">
        <div className="card-header bg-light fw-bold">Cabecera</div>
        <div className="card-body">
          <p>
            <strong>Fecha de emisión:</strong>{" "}
            {new Date(factura["fecha_emision"]).toLocaleDateString("es-ES")}
          </p>
          <p>
            <strong>Huésped:</strong>{" "}
            {factura.nombre_huesped ||
              (factura.cliente
                ? `${factura.cliente.nombre} ${
                    factura.cliente.primer_apellido ?? ""
                  } ${factura.cliente.segundo_apellido ?? ""}`
                : "—")}
          </p>
          <p>
            <strong>Forma de pago:</strong> {factura.forma_pago}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={`badge ${
                factura.estado === "Pagada"
                  ? "bg-success"
                  : factura.estado === "Anulada"
                  ? "bg-danger"
                  : "bg-warning"
              }`}
            >
              {factura.estado}
            </span>
          </p>
        </div>
      </div>

      {/* Datos del cliente si existen */}
      {factura.cliente && (
        <div className="card mb-4">
          <div className="card-header bg-light fw-bold">Datos del cliente</div>
          <div className="card-body">
            <p>
              <strong>Nombre:</strong> {factura.cliente.nombre}{" "}
              {factura.cliente.primer_apellido}{" "}
              {factura.cliente.segundo_apellido ?? ""}
            </p>
            <p>
              <strong>Documento:</strong> {factura.cliente.numero_documento}
            </p>
            <p>
              <strong>Dirección:</strong> {factura.cliente.direccion}
            </p>
            <p>
              <strong>Ciudad:</strong> {factura.cliente.ciudad}
            </p>
            <p>
              <strong>País:</strong> {factura.cliente.pais}
            </p>
          </div>
        </div>
      )}

      {/* Tabla de cargos asociados a la factura */}
      <div className="card mb-4">
        <div className="card-header bg-light fw-bold">Cargos</div>
        <table className="table table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Precio Unitario (€)</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {factura.detalles?.map((d, index) => (
              <tr key={index}>
                <td>{d.fecha}</td>
                <td>{d.concepto}</td>
                <td>{d.cantidad}</td>
                <td>{parseFloat(d.precio_unitario).toFixed(2)}</td>
                <td>{parseFloat(d.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-footer text-end fw-bold">
          Total factura: {total} €
        </div>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1); // vuelve a la página anterior
            } else {
              navigate("/informes/facturacion"); // o ruta por defecto
            }
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default VerFactura;
