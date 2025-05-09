/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuscarClientes = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [criterio, setCriterio] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("id");
  const [clientes, setClientes] = useState([]);

  const buscar = async () => {
    if (!criterio.trim()) {
      toast.warning("Introduce un valor de búsqueda");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes/${tipoBusqueda}/${encodeURIComponent(criterio)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // El backend puede devolver un único cliente o un array
      const resultado = Array.isArray(res.data) ? res.data : [res.data];
      // Ordenar los clientes por apellido
      const clientesOrdenados = resultado.sort((a, b) => {
        const apellidoA = a.primer_apellido.toLowerCase();
        const apellidoB = b.primer_apellido.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      });
      setClientes(clientesOrdenados);
    } catch (error) {
      const msg = error.response?.data?.detalle || "Cliente no encontrado";
      toast.error(msg);
      setClientes([]);
    }
  };


  const irAEditar = (id) => {
    navigate(`/clientes/editar/${id}`);
  };

  return (
    <div className="container py-5 mt-1">
      <h2 className="mb-4 text-center">Buscar clientes</h2>

      <form 
      onSubmit={(e) => {
        e.preventDefault();
        buscar();
      }}
      className="row g-2 mb-4 mx-auto"
       style={{ maxWidth: "700px", textAlign: "center" }}>
        <div className="col-md-3"
       >
          <select
            className="form-select"
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
          >
            <option value="id">Buscar por ID</option>
            <option value="documento">Buscar por documento</option>
            <option value="apellido">Buscar por apellido</option>
          </select>
        </div>

        <div className="col-md-6">
          <input
            type="text"
            placeholder="Introduce el valor"
            className="form-control"
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
          />
        </div>

        <div className="col-md-3 d-grid d-md-flex justify-content-md-start">
          <button className="btn btn-primary me-2">
            Buscar
          </button>
        </div>
      </form>

      {clientes.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id_cliente}>
                  <td>{c.id_cliente}</td>
                  <td>{`${c.primer_apellido} ${c.segundo_apellido || ""}, ${c.nombre}`}</td>
                  <td>{`${c.tipo_documento} ${c.numero_documento}`}</td>
                  <td>{c.telefono || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => irAEditar(c.id_cliente)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No hay clientes para mostrar.</p>
      )}
    </div>
  );
}

export default BuscarClientes;
