// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const informeController = require("../controllers/informeController");
const authMiddleware = require("../middlewares/authMiddleware");


// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener el informe de ocupación
router.get("/ocupacion", informeController.obtenerOcupacionEntreFechas);

// Obtener el informe de facturación
router.get("/facturacion", informeController.obtenerFacturacionPorFecha);

// Obtener el informe de facturación entre fechas
router.get("/facturacion/rango", informeController.obtenerFacturacionEntreFechas);

// Obtener el informe de cargos por habitación
router.get("/cargos", informeController.obtenerCargosPendientesPorHabitacion);

// Estado actual de habitaciones
router.get("/estado-habitaciones", informeController.obtenerEstadoActualHabitaciones);

// Clientes alojados actualmente
router.get("/clientes-alojados", informeController.obtenerClientesAlojadosActualmente);

// Listado de llegadas por fecha
router.get("/llegadas", informeController.obtenerLlegadasPorFecha);

// Listado de salidas por fecha
router.get("/salidas", informeController.obtenerSalidasPorFecha);

// Resumen de actividad diaria
router.get("/resumen-dia", informeController.obtenerResumenActividadDiaria);

// Consumo por forma de pago
router.get("/consumo-forma-pago", informeController.obtenerConsumoPorFormaPago);

// KPIs para dashboard
router.get("/kpis", informeController.obtenerKPIsDashboard);

// Ocupación semanal para dashboard
router.get("/ocupacion-semanal", informeController.obtenerOcupacionSemanal);

// Reservas por estado para dashboard
router.get("/reservas-estado", informeController.obtenerReservasPorEstado);

// Ingresos por mes para dashboard
router.get("/ingresos-mes", informeController.obtenerIngresosPorMes);


// Exporta el router para su uso en la aplicación principal
module.exports = router;
