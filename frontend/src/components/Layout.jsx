import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const esLogin = location.pathname === "/";

  return (
    <>
      {!esLogin && <Navbar />}
      <main className={esLogin ? "" : "contenedor-general"}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

