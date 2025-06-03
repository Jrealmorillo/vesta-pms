// Página para visualizar el detalle de una factura
// Muestra la cabecera, datos del cliente y los cargos asociados a la factura.
// Incluye carga asíncrona, manejo de errores y cálculo del total.

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
  }, [id, token]);

  // Función para anular una factura
  const anularFactura = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Anular factura?",
      text: "Esta acción no se puede deshacer. La factura y todos sus cargos serán anulados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/facturas/${id}/anular`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Factura anulada correctamente");

      // Recargar los datos de la factura
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/facturas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFactura(data);
    } catch (error) {
      toast.error(
        `Error al anular la factura: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Muestra mensaje mientras se carga la factura
  if (!factura)
    return <div className="container py-5">Cargando factura...</div>;

  // Calcula el total sumando los cargos
  const total = factura.detalles
    ?.reduce((sum, d) => sum + parseFloat(d.total || 0), 0)
    .toFixed(2);
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center justify-content-between">
                {" "}
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-receipt text-primary me-3"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div>
                    <h4 className="mb-0 fw-semibold">
                      Factura #{factura.id_factura}
                    </h4>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {factura.estado !== "Anulada" && (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/facturas/editar/${id}`)}
                        title="Editar factura"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={anularFactura}
                        title="Anular factura"
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Anular
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      if (window.history.length > 1) {
                        navigate(-1);
                      } else {
                        navigate("/facturas/buscar");
                      }
                    }}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Información del Huésped */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-person-check me-2 text-muted"></i>
                Información del Huésped
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">
                      Nombre completo:
                    </span>
                    <br />
                    <strong>
                      {factura.reserva.nombre_huesped
                        ? `${factura.reserva.nombre_huesped} ${
                            factura.reserva.primer_apellido_huesped || ""
                          } ${factura.reserva.segundo_apellido_huesped || ""}`
                        : "—"}
                    </strong>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">
                      Reserva asociada:
                    </span>
                    <br />
                    <strong>#{factura.id_reserva}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Información de Facturación */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-file-earmark-text me-2 text-muted"></i>
                Información de Facturación
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">
                      Fecha de emisión:
                    </span>
                    <br />
                    <strong>
                      {new Date(factura.fecha_emision).toLocaleDateString(
                        "es-ES"
                      )}
                    </strong>
                  </p>

                  {/* Mostrar empresa si existe */}
                  {factura.empresa && (
                    <p className="mb-2">
                      <span className="text-muted fw-medium">
                        Facturado a empresa:
                      </span>
                      <br />
                      <strong className="text-primary">
                        {factura.empresa.nombre}
                      </strong>
                      {factura.empresa.cif && (
                        <>
                          <br />
                          <small className="text-muted">
                            CIF: {factura.empresa.cif}
                          </small>
                        </>
                      )}
                      {factura.empresa.direccion && (
                        <>
                          <br />
                          <small className="text-muted">
                            {factura.empresa.direccion}
                            {factura.empresa.ciudad &&
                              `, ${factura.empresa.ciudad}`}
                            {factura.empresa.pais &&
                              `, ${factura.empresa.pais}`}
                          </small>
                        </>
                      )}
                    </p>
                  )}

                  {/* Mostrar cliente si existe */}
                  {factura.cliente && (
                    <p className="mb-2">
                      <span className="text-muted fw-medium">
                        Facturado a cliente:
                      </span>
                      <br />
                      <strong className="text-info">
                        {factura.cliente.nombre}{" "}
                        {factura.cliente.primer_apellido ?? ""}{" "}
                        {factura.cliente.segundo_apellido ?? ""}
                      </strong>
                      {factura.cliente.numero_documento && (
                        <>
                          <br />
                          <small className="text-muted">
                            Doc: {factura.cliente.numero_documento}
                          </small>
                        </>
                      )}
                      {factura.cliente.direccion && (
                        <>
                          <br />
                          <small className="text-muted">
                            {factura.cliente.direccion}
                            {factura.cliente.ciudad &&
                              `, ${factura.cliente.ciudad}`}
                            {factura.cliente.pais &&
                              `, ${factura.cliente.pais}`}
                          </small>
                        </>
                      )}
                    </p>
                  )}

                  {/* Si no hay empresa ni cliente específico */}
                  {!factura.empresa && !factura.cliente && (
                    <p className="mb-2">
                      <span className="text-muted fw-medium">Facturado a:</span>
                      <br />
                      <strong>Huésped (facturación directa)</strong>
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Forma de pago:</span>
                    <br />
                    <strong>{factura.forma_pago}</strong>
                  </p>
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Estado:</span>
                    <br />
                    <span
                      className={`badge ${
                        factura.estado === "Pagada"
                          ? "bg-success-subtle text-success"
                          : factura.estado === "Anulada"
                          ? "bg-danger-subtle text-danger"
                          : "bg-warning-subtle text-warning"
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Total factura:</span>
                    <br />
                    <strong className="text-primary fs-5">
                      {total}€
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Tabla de cargos asociados a la factura */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-list-ul me-2 text-muted"></i>
                Detalle de Cargos
                <span className="badge bg-primary ms-2">
                  {factura.detalles?.length || 0}
                </span>
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Fecha</th>
                      <th className="fw-semibold">Concepto</th>
                      <th className="fw-semibold text-center">Cantidad</th>
                      <th className="fw-semibold text-end">Precio Unit.</th>
                      <th className="fw-semibold text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.detalles?.map((d, index) => (
                      <tr key={index}>
                        <td>{d.fecha}</td>
                        <td>{d.concepto}</td>
                        <td className="text-center">{d.cantidad}</td>
                        <td className="text-end">
                          {parseFloat(d.precio_unitario).toFixed(2)}€
                        </td>
                        <td className="text-end fw-medium">
                          {parseFloat(d.total).toFixed(2)}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>{" "}
            <div className="card-footer bg-light">
              <div className="d-flex justify-content-end">
                <h5 className="mb-0 fw-bold text-primary">
                  Total factura: {total}€
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerFactura;
