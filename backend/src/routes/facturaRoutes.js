const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const authMiddleware = require("../middlewares/authMiddleware");

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear una nueva factura
router.post("/", facturaController.crearFactura);

// Obtener una factura por ID
router.get("/:id", facturaController.obtenerFacturaPorId);

// Modificar datos de una factura
router.put("/:id", facturaController.modificarFactura);

// Anular una factura (marcar como anulada y anular cargos)
router.put("/:id/anular", facturaController.anularFactura);

module.exports = router;
