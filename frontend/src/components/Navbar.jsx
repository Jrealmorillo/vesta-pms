import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import routes from "../routes";

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const manejarLogout = () => {
    logout();
    navigate("/")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
      <Link className="navbar-brand" to="/dashboard">Vesta PMS</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {routes.map((ruta) => (
            <li className="nav-item" key={ruta.path}>
              <NavLink to={ruta.path} className="nav-link">{ruta.label}</NavLink>
            </li>
          ))}
        </ul>
        {usuario && (
          <span className="navbar-text">
            {usuario.nombre_usuario} &nbsp;
            <button className="btn btn-sm btn-outline-light ms-2" onClick={manejarLogout}>Cerrar sesión</button>
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
