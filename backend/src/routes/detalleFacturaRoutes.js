// Rutas para operaciones relacionadas con los detalles de factura.
// Aplica el middleware de autenticación a todas las rutas y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const detalleFacturaController = require("../controllers/detalleFacturaController");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica el middleware de autenticación JWT a todas las rutas de este router
router.use(authMiddleware);

// Añadir un nuevo detalle de factura
router.post("/", detalleFacturaController.registrarDetalle);

// Modificar un detalle existente
router.put("/:id", detalleFacturaController.modificarDetalle);

// Anular (convertir a negativo) un detalle existente
router.put("/:id/anular", detalleFacturaController.anularDetalle);

// Obtener cargos no facturados de una reserva
router.get("/pendientes/:id_reserva", detalleFacturaController.obtenerPendientesPorReserva);

// Adelantar cargos desde líneas de reserva
router.post("/adelantar/:id_reserva", detalleFacturaController.adelantarCargosDesdeLineas);

// Exporta el router para su uso en la aplicación principal
module.exports = router;
