const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const authMiddleware = require("../middlewares/authMiddleware");

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear una nueva reserva
router.post("/registro", reservaController.crearReserva);

// Obtener una reserva por ID
router.get("/id/:id", reservaController.obtenerReservaPorId);

// Modificar una reserva
router.put("/:id", reservaController.modificarReserva);

// Cambiar el estado de una reserva (anular, confirmar, check-in, etc.)
router.put("/:id/cambiar-estado", reservaController.cambiarEstado);

// Buscar reservas por fecha de entrada
router.get("/entrada/:fecha", reservaController.obtenerReservaPorFechaEntrada);

// Buscar reservas por apellido del huésped
router.get("/apellido/:apellido", reservaController.obtenerReservaPorApellido);

// Buscar reservas por nombre de empresa
router.get("/empresa/:empresa", reservaController.obtenerReservaPorEmpresa);

module.exports = router;
