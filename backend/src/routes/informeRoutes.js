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


// Exporta el router para su uso en la aplicación principal
module.exports = router;
