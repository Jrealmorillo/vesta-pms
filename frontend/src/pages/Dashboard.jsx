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
  Filler,
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
  LineElement,
  Filler
);

const Dashboard = () => {
  // KPIs
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
  });
  const [reservasEstado, setReservasEstado] = useState({
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
    <div className="container py-5 mt-4" style={{ maxWidth: "1400px" }}>
      <div className="d-flex align-items-center mb-5">
        <i className="bi bi-speedometer2 me-3 text-primary fs-2"></i>
        <h1 className="mb-0 fw-light">Dashboard Hotel</h1>
      </div>
      {/* Resumen de actividad diaria */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-arrow-down-circle text-success me-2 fs-4"></i>
                <h5 className="mb-0 text-success">Llegadas de hoy</h5>
              </div>
              <div className="row text-center">
                <div className="col-6">
                  <div className="p-3 bg-success bg-opacity-10 rounded">
                    <div className="h3 text-success mb-1">
                      {reservasEstado.llegadasRealizadas}
                    </div>
                    <small className="text-muted">Realizadas</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    <div className="h3 text-warning mb-1">
                      {reservasEstado.llegadasPendientes}
                    </div>
                    <small className="text-muted">Pendientes</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-arrow-up-circle text-info me-2 fs-4"></i>
                <h5 className="mb-0 text-info">Salidas de hoy</h5>
              </div>
              <div className="row text-center">
                <div className="col-6">
                  <div className="p-3 bg-success bg-opacity-10 rounded">
                    <div className="h3 text-success mb-1">
                      {reservasEstado.salidasRealizadas}
                    </div>
                    <small className="text-muted">Realizadas</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-warning bg-opacity-10 rounded">
                    <div className="h3 text-warning mb-1">
                      {reservasEstado.salidasPendientes}
                    </div>
                    <small className="text-muted">Pendientes</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* KPIs rápidos */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div
            className="card border-0 shadow-lg mb-3 text-center"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-building me-2 fs-3"></i>
                <h5 className="card-title mb-0">Ocupación actual</h5>
              </div>
              <p className="display-5 fw-bold mb-2">
                {kpis.ocupacionReal}%{" "}
                <span className="fs-6 opacity-75">real</span>
              </p>
              <div className="border-top border-light border-opacity-25 pt-3">
                <p className="display-6 mb-0 text-white-50">
                  {kpis.ocupacionPrevista}%{" "}
                  <span className="fs-6">prevista</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="card border-0 shadow-lg mb-3 text-center"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-currency-euro me-2 fs-3"></i>
                <h5 className="card-title mb-0">Ingresos mes (€)</h5>
              </div>
              <p className="display-5 fw-bold mb-2">
                {kpis.ingresos.toLocaleString()}{" "}
                <span className="fs-6 opacity-75">real</span>
              </p>
              <div className="border-top border-light border-opacity-25 pt-3">
                <p className="display-6 mb-0 text-white-50">
                  {kpis.ingresosPrevistos.toLocaleString()}{" "}
                  <span className="fs-6">previsto</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* KPIs de reservas */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-3 text-center">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-calendar-week text-success me-2 fs-3"></i>
                <h5 className="card-title text-success mb-0">
                  Reservas esta semana
                </h5>
              </div>
              <p className="display-5 fw-bold text-success">
                {kpis.reservasSemanales}
              </p>
              <small className="text-muted">Entrada programada</small>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm mb-3 text-center">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="bi bi-calendar-month text-info me-2 fs-3"></i>
                <h5 className="card-title text-info mb-0">Reservas este mes</h5>
              </div>
              <p className="display-5 fw-bold text-info">
                {kpis.reservasMensuales}
              </p>
              <small className="text-muted">Entrada programada</small>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Gráficos */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-bar-chart text-primary me-2 fs-4"></i>
              <h5 className="mb-0">Ocupación semanal (%)</h5>
            </div>
            <Bar
              data={{
                labels: ocupacion.labels,
                datasets: [
                  {
                    label: "Real",
                    data: ocupacion.reales,
                    backgroundColor: "rgba(102, 126, 234, 0.8)",
                    borderColor: "#667eea",
                    borderWidth: 2,
                    borderRadius: 6,
                  },
                  {
                    label: "Prevista",
                    data: ocupacion.previstas,
                    backgroundColor: "rgba(255, 193, 7, 0.8)",
                    borderColor: "#ffc107",
                    borderWidth: 2,
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                    },
                  },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    grid: {
                      color: "rgba(0,0,0,0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>{" "}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <i className="bi bi-pie-chart text-success me-2 fs-4"></i>
              <h5 className="mb-0 text-center">
                Reservas confirmadas vs anuladas (hoy)
              </h5>
            </div>
            <div
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pie
                data={{
                  labels: estadosGrafico,
                  datasets: [
                    {
                      data: dataGrafico,
                      backgroundColor: [
                        "rgba(25, 135, 84, 0.8)", // Confirmadas
                        "rgba(220, 53, 69, 0.8)", // Anuladas
                      ],
                      borderColor: ["#198754", "#dc3545"],
                      borderWidth: 3,
                      hoverBackgroundColor: [
                        "rgba(25, 135, 84, 0.9)",
                        "rgba(220, 53, 69, 0.9)",
                      ],
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
                          size: 14,
                        },
                        usePointStyle: true,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-graph-up text-info me-2 fs-4"></i>
              <h5 className="mb-0">Ingresos por mes (€)</h5>
            </div>
            <Line
              data={{
                labels: ingresosMes.labels,
                datasets: [
                  {
                    label: "Real",
                    data: ingresosMes.reales,
                    borderColor: "#198754",
                    backgroundColor: "rgba(25,135,84,0.1)",
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: "#198754",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    fill: true,
                  },
                  {
                    label: "Previsto",
                    data: ingresosMes.previstas,
                    borderColor: "#ffc107",
                    backgroundColor: "rgba(255,193,7,0.1)",
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: "#ffc107",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    fill: true,
                    borderDash: [5, 5],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                    },
                  },
                },
                scales: {
                  y: {
                    grid: {
                      color: "rgba(0,0,0,0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
