import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {  // KPIs
  const [kpis, setKpis] = useState({
    ocupacionReal: 0,
    ocupacionPrevista: 0,
    reservasSemanales: 0,
    reservasMensuales: 0,
    ingresos: 0,
    ingresosPrevistos: 0,
  });
  // Datos para gráficos
  const [ocupacion, setOcupacion] = useState({
    labels: [],
    reales: [],
    previstas: [],
  });  const [reservasEstado, setReservasEstado] = useState({
    labels: [],
    data: [],
    llegadasPrevistas: 0,
    llegadasRealizadas: 0,
    llegadasPendientes: 0,
    salidasPrevistas: 0,
    salidasRealizadas: 0,
    salidasPendientes: 0,
  });
  const [ingresosMes, setIngresosMes] = useState({
    labels: [],
    reales: [],
    previstas: [],
  });

  useEffect(() => {
    // KPIs rápidos
    axios
      .get(`${import.meta.env.VITE_API_URL}/informes/kpis`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setKpis(res.data);
      })
      .catch(() => {});

    // Ocupación semanal
    axios
      .get(`${import.meta.env.VITE_API_URL}/informes/ocupacion-semanal`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setOcupacion(res.data);
      })
      .catch(() => {});

    // Reservas por estado
    axios
      .get(`${import.meta.env.VITE_API_URL}/informes/reservas-estado`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setReservasEstado(res.data);
      })
      .catch(() => {});

    // Ingresos por mes
    axios
      .get(`${import.meta.env.VITE_API_URL}/informes/ingresos-mes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIngresosMes(res.data);
      })
      .catch(() => {});
  }, []);
  // Solo mostrar Confirmadas y Anuladas en el gráfico
  const estadosGrafico = ["Confirmadas", "Anuladas"];
  const dataGrafico = estadosGrafico.map((estado) => {
    const idx = reservasEstado.labels.indexOf(estado);
    return idx !== -1 ? reservasEstado.data[idx] : 0;
  });


  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "1200px" }}>
      <h2 className="mb-4">Dashboard Hotel</h2>      {/* Tarjeta para llegadas y salidas */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card mb-3 border border-0 text-center">
            <div className="card-body">              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary mb-2">LLEGADAS HOY</h6>
                  <span className="badge bg-success mx-2 fs-6">
                    Realizadas: {reservasEstado.llegadasRealizadas}
                  </span>
                  <span className="badge bg-info mx-2 fs-6">
                    Pendientes: {reservasEstado.llegadasPendientes}
                  </span>
                </div>
                <div className="col-md-6">
                  <h6 className="text-secondary mb-2">SALIDAS HOY</h6>
                  <span className="badge bg-success mx-2 fs-6">
                    Realizadas: {reservasEstado.salidasRealizadas}
                  </span>
                  <span className="badge bg-info mx-2 fs-6">
                    Pendientes: {reservasEstado.salidasPendientes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* KPIs rápidos */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-bg-primary mb-3 text-center">
            <div className="card-body">
              <h5 className="card-title">Ocupación actual</h5>
              <p className="display-5 fw-bold">
                {kpis.ocupacionReal}% <span className="fs-6">real</span>
              </p>
              <p className="display-6 text-info">
                {kpis.ocupacionPrevista}% <span className="fs-6">prevista</span>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-bg-dark mb-3 text-center">
            <div className="card-body">
              <h5 className="card-title">Ingresos mes (€)</h5>
              <p className="display-5 fw-bold">
                {kpis.ingresos.toLocaleString()}{" "}
                <span className="fs-6">real</span>
              </p>
              <p className="display-6 text-info">
                {kpis.ingresosPrevistos.toLocaleString()}{" "}
                <span className="fs-6">previsto</span>
              </p>
            </div>
          </div>
        </div>
      </div>      {/* KPIs de reservas */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-bg-success mb-3 text-center">
            <div className="card-body">
              <h5 className="card-title">Reservas esta semana</h5>
              <p className="display-5 fw-bold">{kpis.reservasSemanales}</p>
              <small className="text-light">Entrada programada</small>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-bg-info mb-3 text-center">
            <div className="card-body">
              <h5 className="card-title">Reservas este mes</h5>
              <p className="display-5 fw-bold">{kpis.reservasMensuales}</p>
              <small className="text-light">Entrada programada</small>
            </div>
          </div>
        </div>
      </div>{/* Gráficos */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card p-3">
            <h5 className="mb-3">Ocupación semanal (%)</h5>
            <Bar
              data={{
                labels: ocupacion.labels,
                datasets: [
                  {
                    label: "Real",
                    data: ocupacion.reales,
                    backgroundColor: "#0d6efd",
                  },
                  {
                    label: "Prevista",
                    data: ocupacion.previstas,
                    backgroundColor: "#ffc107",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: { y: { min: 0, max: 100 } },
              }}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="card p-3">
            <h5 className="mb-3 text-center">Reservas confirmadas vs anuladas (hoy)</h5>
            <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Pie
                data={{
                  labels: estadosGrafico,
                  datasets: [
                    {
                      data: dataGrafico,
                      backgroundColor: [
                        "#198754", // Confirmadas
                        "#dc3545", // Anuladas
                      ],
                      borderWidth: 2,
                      borderColor: "#fff",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: "bottom",
                      labels: {
                        padding: 20,
                        font: {
                          size: 14
                        }
                      }
                    } 
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card p-3">
            <h5 className="mb-3">Ingresos por mes (€)</h5>
            <Line
              data={{
                labels: ingresosMes.labels,
                datasets: [
                  {
                    label: "Real",
                    data: ingresosMes.reales,
                    borderColor: "#198754",
                    backgroundColor: "rgba(25,135,84,0.2)",
                    tension: 0.3,
                  },
                  {
                    label: "Previsto",
                    data: ingresosMes.previstas,
                    borderColor: "#ffc107",
                    backgroundColor: "rgba(255,193,7,0.2)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
