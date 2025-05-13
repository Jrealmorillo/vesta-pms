import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const NuevaReserva = () => {
  const { token } = useContext(AuthContext);

  const [reserva, setReserva] = useState({
    nombre_huesped: "",
    primer_apellido_huesped: "",
    segundo_apellido_huesped: "",
    id_cliente: null,
    id_empresa: null,
    fecha_entrada: "",
    fecha_salida: "",
    numero_habitacion: "",
    observaciones: "",
  });

  const [lineas, setLineas] = useState([]);

  const [nuevaLinea, setNuevaLinea] = useState({
    tipo_habitacion: "",
    fecha: "",
    cantidad_habitaciones: 1,
    precio: "",
    regimen: "",
    cantidad_adultos: 1,
    cantidad_ninos: 0,
  });

  const manejarCambioReserva = (e) => {
    const { name, value } = e.target;
  
    // Convertir a null si está vacío, y a número si es id_cliente o id_empresa
    let nuevoValor = value === "" ? null : value;
  
    if (["id_cliente", "id_empresa"].includes(name)) {
      nuevoValor = value === "" ? null : parseInt(value, 10);
    }
  
    setReserva({ ...reserva, [name]: nuevoValor });
  };
  

  const manejarCambioLinea = (e) => {
    const { name, value } = e.target;
    setNuevaLinea({ ...nuevaLinea, [name]: value });
  };

  const añadirLinea = () => {
    if (
      !nuevaLinea.tipo_habitacion ||
      !nuevaLinea.fecha ||
      !nuevaLinea.precio
    ) {
      toast.warning("Completa todos los campos de la línea");
      return;
    }

    const fechaLinea = new Date(nuevaLinea.fecha);
    const entrada = new Date(reserva.fecha_entrada);
    const salida = new Date(reserva.fecha_salida);

    // Ajustar horas a 00:00 para comparación precisa
    entrada.setHours(0, 0, 0, 0);
    salida.setHours(0, 0, 0, 0);

    if (fechaLinea < entrada || fechaLinea >= salida) {
      toast.warning(
        "La fecha de la línea debe estar dentro del rango de la estancia"
      );
      return;
    }

    setLineas([...lineas, nuevaLinea]);
    setNuevaLinea({
      tipo_habitacion: "",
      fecha: "",
      cantidad_habitaciones: 1,
      precio: "",
      regimen: "",
      cantidad_adultos: 1,
      cantidad_ninos: 0,
    });
  };

  const eliminarLinea = (index) => {
    const nuevas = [...lineas];
    nuevas.splice(index, 1);
    setLineas(nuevas);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (lineas.length === 0) {
      toast.error("Debe añadir al menos una línea de reserva");
      return;
    }

    const entrada = new Date(reserva.fecha_entrada);
    const salida = new Date(reserva.fecha_salida);
    const hoyDate = new Date();
    hoyDate.setHours(0, 0, 0, 0); // Quita la parte de la hora para comparar bien

    if (entrada < hoyDate) {
      toast.error("La fecha de entrada no puede ser anterior a hoy");
      return;
    }

    if (salida <= entrada) {
      toast.error("La fecha de salida debe ser posterior a la de entrada");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/reservas/registro`,
        {
          ...reserva,
          estado: "Confirmada",
          lineas,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Reserva registrada correctamente");
      setReserva({
        nombre_huesped: "",
        primer_apellido_huesped: "",
        segundo_apellido_huesped: "",
        id_cliente: null,
        id_empresa: null,
        fecha_entrada: "",
        fecha_salida: "",
        numero_habitacion: "",
        observaciones: "",
      });
      setLineas([]);
    } catch (error) {
      const msg =
        error.response?.data?.error || "Error al registrar la reserva";
      toast.error(msg);
    }
  };

  // Obtenemos la fecha actual
  const hoy = new Date().toISOString().split("T")[0];

  // Convertimos fechas de entrada y salida a formato YYYY-MM-DD
  const fechaEntradaMin = reserva.fecha_entrada || "";
  const fechaSalidaMax = reserva.fecha_salida
    ? new Date(new Date(reserva.fecha_salida).getTime() - 86400000) // 1 día menos
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <div className="container pt-4">
      <h2 className="text-center my-4">Registrar nueva reserva</h2>

      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "850px" }}
      >
        {/* Card: Datos de la reserva */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-info text-white">
            <strong>Datos de reserva</strong>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Cliente</label>
                <input
                type="number"
                  name="id_cliente"
                  className="form-control"
                  placeholder="Cliente"
                  value={reserva.id_cliente || ""}
                  onChange={manejarCambioReserva}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Empresa</label>
                <input
                  type="number"
                  name="id_empresa"
                  className="form-control"
                  placeholder="Empresa"
                  value={reserva.id_empresa || ""}
                  onChange={manejarCambioReserva}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Nombre del huésped</label>
                <input
                  name="nombre_huesped"
                  className="form-control"
                  placeholder="Nombre"
                  value={reserva.nombre_huesped}
                  onChange={manejarCambioReserva}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Primer apellido</label>
                <input
                  name="primer_apellido_huesped"
                  className="form-control"
                  placeholder="1º Apellido"
                  value={reserva.primer_apellido_huesped}
                  onChange={manejarCambioReserva}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Segundo apellido</label>
                <input
                  name="segundo_apellido_huesped"
                  className="form-control"
                  placeholder="2º Apellido"
                  value={reserva.segundo_apellido_huesped}
                  onChange={manejarCambioReserva}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Fecha de entrada</label>
                <input
                  type="date"
                  name="fecha_entrada"
                  className="form-control"
                  min={hoy}
                  value={reserva.fecha_entrada}
                  onChange={manejarCambioReserva}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fecha de salida</label>
                <input
                  type="date"
                  name="fecha_salida"
                  className="form-control"
                  min={reserva.fecha_entrada || hoy}
                  value={reserva.fecha_salida}
                  onChange={manejarCambioReserva}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Número de habitación</label>
                <input
                  name="numero_habitacion"
                  className="form-control"
                  placeholder="Ej: 204"
                  value={reserva.numero_habitacion}
                  onChange={manejarCambioReserva}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                className="form-control"
                placeholder="Observaciones adicionales..."
                rows="2"
                value={reserva.observaciones}
                onChange={manejarCambioReserva}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Card: Líneas de reserva */}
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white">
            <strong>Líneas de reserva</strong>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={nuevaLinea.fecha}
                  min={fechaEntradaMin}
                  max={fechaSalidaMax}
                  onChange={manejarCambioLinea}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Tipo habitación</label>
                <select
                  name="tipo_habitacion"
                  className="form-select"
                  value={nuevaLinea.tipo_habitacion}
                  onChange={manejarCambioLinea}
                >
                  <option value="" disabled>Selecciona tipo</option>
                  <option value="Individual">Individual</option>
                  <option value="Doble">Doble</option>
                  <option value="Triple">Triple</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  name="cantidad_habitaciones"
                  className="form-control"
                  min="1"
                  value={nuevaLinea.cantidad_habitaciones}
                  onChange={manejarCambioLinea}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Régimen</label>
                <select
                  name="regimen"
                  className="form-select"
                  value={nuevaLinea.regimen}
                  onChange={manejarCambioLinea}
                >
                  <option value="" disabled>Selecciona régimen</option>
                  <option value="Solo Alojamiento">Solo Alojamiento</option>
                  <option value="Alojamiento y Desayuno">
                    Alojamiento y Desayuno
                  </option>
                  <option value="Media Pension">Media Pensión</option>
                  <option value="Pension completa">Pensión Completa</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-2">
                <label className="form-label">Adultos</label>
                <input
                  name="cantidad_adultos"
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={nuevaLinea.cantidad_adultos}
                  onChange={manejarCambioLinea}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Niños</label>
                <input
                  name="cantidad_ninos"
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={nuevaLinea.cantidad_ninos}
                  onChange={manejarCambioLinea}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">€/noche</label>
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Precio/noche"
                  value={nuevaLinea.precio}
                  onChange={manejarCambioLinea}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={añadirLinea}
                >
                  Añadir línea
                </button>
              </div>
            </div>

            {/* Lista de líneas añadidas */}
            {lineas.length > 0 && (
              <ul className="list-group">
                {lineas.map((l, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {l.fecha} - {l.tipo_habitacion} ({l.regimen}) -{" "}
                      {l.cantidad_habitaciones} hab. - {l.precio}€
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarLinea(i)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Registrar reserva
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaReserva;
