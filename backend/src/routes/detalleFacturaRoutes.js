const express = require("express");
const router = express.Router();
const detalleFacturaController = require("../controllers/detalleFacturaController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Añadir un nuevo detalle
router.post("/", detalleFacturaController.registrarDetalle);

// Modificar un detalle existente
router.put("/:id", detalleFacturaController.modificarDetalle);

// Anular un detalle (convertir a negativo)
router.put("/:id/anular", detalleFacturaController.anularDetalle);

// Obtener cargos no facturados de una reserva
router.get("/pendientes/:id_reserva", detalleFacturaController.obtenerPendientesPorReserva);

// Adelantar cargos desde líneas de reserva
router.post("/adelantar/:id_reserva", detalleFacturaController.adelantarCargosDesdeLineas);

module.exports = router;
