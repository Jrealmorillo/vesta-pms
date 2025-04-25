import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const obtenerCliente = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/clientes/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCliente(Array.isArray(res.data) ? res.data[0] : res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Error al cargar los datos del cliente");
        navigate("/clientes/buscar");
      }
    };

    obtenerCliente();
  }, [id, token, navigate]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Evitar envío de email vacío
    if (cliente.email?.trim() === "") {
      cliente.email = null;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/clientes/${id}`,
        cliente,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cliente actualizado correctamente");
      navigate("/clientes/buscar");
    } catch (error) {
      const msg =
        error.response?.data?.detalle || "Error al actualizar cliente";
      toast.error(msg);
    }
  };

  if (!cliente) return <p className="text-center mt-5">Cargando cliente...</p>;

  return (
    <div className="container py-4 mt-4">
      <h2 className="text-center mb-4">Editar cliente</h2>
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "750px", textAlign: "left" }}
      >
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={cliente.nombre}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Primer apellido</label>
            <input
              type="text"
              name="primer_apellido"
              className="form-control"
              value={cliente.primer_apellido}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Segundo apellido</label>
            <input
              type="text"
              name="segundo_apellido"
              className="form-control"
              value={cliente.segundo_apellido || ""}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              value={cliente.fecha_nacimiento}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Género</label>
            <select
              name="genero"
              className="form-select"
              value={cliente.genero}
              onChange={manejarCambio}
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Tipo de documento</label>
            <select
              name="tipo_documento"
              className="form-select"
              value={cliente.tipo_documento}
              onChange={manejarCambio}
              required
            >
              <option value="DNI">DNI</option>
              <option value="NIE">NIE</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="col-md-5 mb-3">
            <label className="form-label">Número de documento</label>
            <input
              type="text"
              name="numero_documento"
              className="form-control"
              value={cliente.numero_documento}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Fecha de expedición</label>
            <input
              type="date"
              name="fecha_expedicion"
              className="form-control"
              value={cliente.fecha_expedicion}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={cliente.direccion || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              className="form-control"
              value={cliente.ciudad || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">País</label>
            <input
              type="text"
              name="pais"
              className="form-control"
              value={cliente.pais}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Código postal</label>
            <input
              type="text"
              name="codigo_postal"
              className="form-control"
              value={cliente.codigo_postal || ""}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              className="form-control"
              value={cliente.telefono || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={cliente.email || ""}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            rows="3"
            value={cliente.observaciones || ""}
            onChange={manejarCambio}
          ></textarea>
        </div>
        <div class="row button-row">
          <div className="col-3">
            <button type="submit" className="btn btn-success">
              Guardar cambios
            </button>
          </div>
          <div className="col-3">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/clientes/buscar")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarCliente;
