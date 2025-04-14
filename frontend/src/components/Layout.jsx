import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="container mt-4 d-flex justify-content-center text-center" style={{ paddingTop: "70px" }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
