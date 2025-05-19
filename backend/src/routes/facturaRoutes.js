// Rutas para operaciones relacionadas con facturas.
// Aplica el middleware de autenticación a todas las rutas y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");
const authMiddleware = require("../middlewares/authMiddleware");

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear una nueva factura
router.post("/", facturaController.crearFactura);

// Modificar datos de una factura existente
router.put("/:id", facturaController.modificarFactura);

// Anular una factura (marcar como anulada y anular cargos)
router.put("/:id/anular", facturaController.anularFactura);

// Buscar facturas por filtros flexibles
router.get("/buscar", facturaController.buscarFacturas);

// Obtener una factura por ID
router.get("/:id", facturaController.obtenerFacturaPorId);

// Exporta el router para su uso en la aplicación principal
module.exports = router;
