// Página para visualizar el detalle de una reserva concreta.
// Permite ver datos generales, líneas asociadas, estado, anular o recuperar la reserva y acceder al historial.
// Incluye feedback visual y navegación a edición o historial de la reserva.

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const VerReserva = () => {
  // Obtiene el id de la reserva desde la URL
  const { id } = useParams();
  // Token de autenticación desde el contexto
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado local para la reserva
  const [reserva, setReserva] = useState(null);

  // Carga la reserva al montar el componente o cambiar id/token
  useEffect(() => {
    const obtenerReserva = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReserva(response.data);
      } catch (error) {
        toast.error(`Error al obtener la reserva: ${error.response?.data?.error || error.message}`);
      }
    };

    obtenerReserva();
  }, [id, token]);

  // Cambia el estado de la reserva a 'Confirmada' (recuperar)
  const recuperarReserva = async () => {
    const resultado = await Swal.fire({
      title: "¿Recuperar reserva?",
      text: "La reserva volverá a estado Confirmada",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, recuperar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });

    if (!resultado.isConfirmed) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${
          reserva.id_reserva
        }/cambiar-estado`,
        { nuevoEstado: "Confirmada" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva recuperada correctamente");

      // Volver a cargar la reserva actualizada
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${reserva.id_reserva}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReserva(response.data);
    } catch (error) {
      toast.error(`Error al recuperar la reserva: ${error.response?.data?.error || error.message}`);
    }
  };

  // Cambia el estado de la reserva a 'Anulada'
  const anularReserva = async () => {
    const resultado = await Swal.fire({
      title: "¿Anular reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!resultado.isConfirmed) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${
          reserva.id_reserva
        }/cambiar-estado`,
        { nuevoEstado: "Anulada" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.warning("Reserva anulada correctamente");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${reserva.id_reserva}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReserva(response.data);
    } catch (error) {
      toast.error(`No se pudo anular la reserva: ${error.response?.data?.error || error.message}`);
    }
  };

  if (!reserva) return <p className="mt-4">Cargando reserva...</p>;

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Detalle de la reserva #{reserva.id_reserva}</h2>
      {/* Estado visual de la reserva */}
      <div className="mb-3">
        <span className="fw-bold">Estado: </span>
        <span
          className={`badge ${
            reserva.estado === "Anulada"
              ? "bg-danger"
              : reserva.estado === "Confirmada"
              ? "bg-success"
              : reserva.estado === "Check-in"
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {reserva.estado}
        </span>
      </div>

      {/* Datos generales de la reserva */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          Datos generales
        </div>
        <div className="card-body">
          <p>
            <strong>Huésped:</strong> {reserva.nombre_huesped}{" "}
            {reserva.primer_apellido_huesped} {reserva.segundo_apellido_huesped}
          </p>
          <p>
            <strong>Fecha de entrada:</strong> {reserva.fecha_entrada}
          </p>
          <p>
            <strong>Fecha de salida:</strong> {reserva.fecha_salida}
          </p>
          <p>
            <strong>Número de habitación:</strong>{" "}
            {reserva.numero_habitacion || "-"}
          </p>
          <p>
            <strong>Observaciones:</strong> {reserva.observaciones || "Ninguna"}
          </p>
          <p>
            <strong>ID cliente:</strong> {reserva.id_cliente || "—"}
          </p>
          <p>
            <strong>ID empresa:</strong> {reserva.id_empresa || "—"}
          </p>
        </div>
      </div>

      {/* Líneas de reserva asociadas */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">Líneas de reserva</div>
        <div className="card-body">
          {reserva.lineas && reserva.lineas.length > 0 ? (
            <ul className="list-group">
              {reserva.lineas.map((linea, index) => (
                <li className="list-group-item" key={index}>
                  {linea.fecha} – {linea.tipo_habitacion} – {linea.regimen} –{" "}
                  {linea.cantidad_habitaciones} hab – {linea.cantidad_adultos}{" "}
                  ad / {linea.cantidad_ninos} ni – {linea.precio} €
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay líneas asociadas.</p>
          )}
        </div>
      </div>
      {/* Botón para recuperar reserva anulada */}
      {reserva.estado === "Anulada" && (
        <div className="mb-3">
          <button className="btn btn-warning btn-lg" onClick={recuperarReserva}>
            Recuperar reserva
          </button>
        </div>
      )}

      {/* Botón para modificar la reserva */}
      <div className="mb-3">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate(`/reservas/editar/${reserva.id_reserva}`)}
        >
          Modificar reserva
        </button>
      </div>
      {/* Enlace al historial de la reserva */}
      <Link
        to={`/reservas/${reserva.id_reserva}/historial`}
        className="btn btn-outline-secondary btn-sm"
      >
        Ver historial
      </Link>

      {/* Botón para anular reserva confirmada */}
      {reserva.estado === "Confirmada" && (
        <div className="mb-3">
          <button
            className="btn btn-outline-danger btn-lg"
            onClick={anularReserva}
          >
            Anular reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default VerReserva;
