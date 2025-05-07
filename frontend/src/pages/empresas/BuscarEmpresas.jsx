/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuscarEmpresas = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [criterio, setCriterio] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("id");
  const [empresas, setEmpresas] = useState([]);

  const buscar = async () => {
    if (!criterio.trim()) {
      toast.warning("Introduce un valor de búsqueda");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/empresas/${tipoBusqueda}/${encodeURIComponent(criterio)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // El backend puede devolver una única empresa o un array
      const resultado = Array.isArray(res.data) ? res.data : [res.data];
      setEmpresas(resultado);
    } catch (error) {
      const msg = error.response?.data?.detalle || "Empresa no encontrada";
      toast.error(msg);
      setEmpresas([]);
    }
  };


  const irAEditar = (id) => {
    navigate(`/empresas/editar/${id}`);
  };

  return (
    <div className="container py-5 mt-1">
      <h2 className="mb-4 text-center">Buscar empresas</h2>

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
            <option value="cif">Buscar por CIF</option>
            <option value="nombre">Buscar por nombre</option>
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

      {empresas.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>CIF</th>
                <th>Direccion</th>
                <th>Ciudad</th>
                <th>Pais</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id_empresa}>
                  <td>{e.id_empresa}</td>
                  <td>{e.nombre}</td>
                  <td>{e.cif}</td>
                  <td>{e.direccion || "-"}</td>
                  <td>{e.ciudad || "-"}</td>
                  <td>{e.pais || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => irAEditar(e.id_empresa)}
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
        <p className="text-center">No hay empresas para mostrar.</p>
      )}
    </div>
  );
}

export default BuscarEmpresas;
