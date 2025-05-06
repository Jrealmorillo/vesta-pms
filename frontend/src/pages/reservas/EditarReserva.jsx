/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


function EditarReserva() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // ID de la reserva
  const navigate = useNavigate();

  const [reserva, setReserva] = useState({
    nombre_huesped: "",
    primer_apellido_huesped: "",
    segundo_apellido_huesped: "",
    fecha_entrada: "",
    fecha_salida: "",
    estado: "",
    observaciones: "",
    id_cliente: "",
    id_empresa: "",
    numero_habitacion: "",
  });

  const [lineas, setLineas] = useState([]);

  const obtenerReserva = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReserva(response.data);
      // Cargar líneas de reserva asociadas
      const responseLineas = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLineas(responseLineas.data);
    } catch (error) {
      toast.error("Error al cargar la reserva");
    }
  };

  useEffect(() => {
    obtenerReserva();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    try {
      const { estado, ...reservaSinEstado } = reserva;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}`,
        reservaSinEstado,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva actualizada correctamente");
      navigate("/reservas/buscar");
    } catch (error) {
      toast.error("Error al actualizar la reserva");
    }
  };

  const manejarCambioLinea = (index, campo, valor) => {
    const actualizadas = [...lineas];
    actualizadas[index][campo] = valor;
    setLineas(actualizadas);
  };

  const guardarLinea = async (linea) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${
          linea.id_linea_reserva
        }`,
        linea,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Recargar líneas y reserva tras editar
      await recargarLineasDesdeServidor();
      toast.success("Línea actualizada");
    } catch (error) {
      toast.error("Error al actualizar línea");
    }
  };

  const eliminarLineaEnBackend = async (id_linea) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${id_linea}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const recargarLineasDesdeServidor = async () => {
    const responseLineas = await axios.get(
      `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLineas(responseLineas.data);

    const responseReserva = await axios.get(
      `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReserva(responseReserva.data);
  };

  const eliminarLinea = async (linea) => {
    try {
      await eliminarLineaEnBackend(linea.id_linea_reserva);
      await recargarLineasDesdeServidor();
      toast.success("Línea eliminada");
    } catch (error) {
      toast.error("Error al eliminar línea");
    }
  };


  return (
    <div className="container py-5 mt-4">
      <h2 className="mb-4">Editar Reserva #{id}</h2>
      <div className="mb-3">
        <span className="fw-bold">Estado de la reserva: </span>
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


      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Nombre huésped</label>
          <input
            type="text"
            className="form-control"
            name="nombre_huesped"
            value={reserva.nombre_huesped}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Primer apellido</label>
          <input
            type="text"
            className="form-control"
            name="primer_apellido_huesped"
            value={reserva.primer_apellido_huesped}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Segundo apellido</label>
          <input
            type="text"
            className="form-control"
            name="segundo_apellido_huesped"
            value={reserva.segundo_apellido_huesped}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha entrada</label>
          <input
            type="date"
            className="form-control"
            name="fecha_entrada"
            value={reserva.fecha_entrada}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha salida</label>
          <input
            type="date"
            className="form-control"
            name="fecha_salida"
            value={reserva.fecha_salida}
            onChange={manejarCambio}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nº Habitación</label>
          <input
            type="text"
            className="form-control"
            name="numero_habitacion"
            value={reserva.numero_habitacion || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-control"
            name="observaciones"
            value={reserva.observaciones}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ID Cliente</label>
          <input
            type="number"
            className="form-control"
            name="id_cliente"
            value={reserva.id_cliente || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ID Empresa</label>
          <input
            type="number"
            className="form-control"
            name="id_empresa"
            value={reserva.id_empresa || ""}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <div className="d-grid">
        <button className="btn btn-success" onClick={guardarCambios}>
          Guardar cambios
        </button>

        <div className="d-grid mt-3">
          <button
            className="btn btn-outline-danger"
            onClick={async () => {
              const resultado = await Swal.fire({
                title: "¿Desea anular la reserva?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, anular",
                cancelButtonText: "No, volver",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
              });

              if (resultado.isConfirmed) {
                try {
                  await axios.put(
                    `${
                      import.meta.env.VITE_API_URL
                    }/reservas/${id}/cambiar-estado`,
                    { nuevoEstado: "Anulada" },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Reserva anulada correctamente");
                  navigate("/reservas/buscar");
                } catch (error) {
                  toast.error("No se pudo anular la reserva");
                }
              }
            }}
          >
            Anular reserva
          </button>
        </div>
      </div>
      <h4 className="mt-5">Líneas de Reserva</h4>

      {lineas.length === 0 ? (
        <p className="text-muted">Esta reserva no tiene líneas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Régimen</th>
                <th>Habitaciones</th>
                <th>Adultos</th>
                <th>Niños</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea, index) => (
                <tr key={linea.id_linea_reserva}>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={linea.fecha || ""}
                      onChange={(e) =>
                        manejarCambioLinea(index, "fecha", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={linea.tipo_habitacion}
                      onChange={(e) =>
                        manejarCambioLinea(
                          index,
                          "tipo_habitacion",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={linea.regimen}
                      onChange={(e) =>
                        manejarCambioLinea(index, "regimen", e.target.value)
                      }
                    >
                      <option value="Solo Alojamiento">Solo Alojamiento</option>
                      <option value="Alojamiento y Desayuno">
                        Alojamiento y Desayuno
                      </option>
                      <option value="Media Pensión">Media Pensión</option>
                      <option value="Pensión Completa">Pensión Completa</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={linea.cantidad_habitaciones}
                      onChange={(e) =>
                        manejarCambioLinea(
                          index,
                          "cantidad_habitaciones",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      max={3}
                      value={linea.cantidad_adultos}
                      onChange={(e) =>
                        manejarCambioLinea(
                          index,
                          "cantidad_adultos",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      max={3}
                      value={linea.cantidad_ninos}
                      onChange={(e) =>
                        manejarCambioLinea(
                          index,
                          "cantidad_ninos",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={linea.precio}
                      onChange={(e) =>
                        manejarCambioLinea(index, "precio", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => guardarLinea(linea)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarLinea(linea)}
                    >
                      Eliminar
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
}

export default EditarReserva;
