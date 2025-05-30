// Rutas para operaciones relacionadas con reservas y sus líneas.
// Aplica el middleware de autenticación a todas las rutas y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
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

// Modificar una reserva existente
router.put("/:id", reservaController.modificarReserva);

// Cambiar el estado de una reserva (anular, confirmar, check-in, etc.)
router.put("/:id/cambiar-estado", reservaController.cambiarEstado);

// Buscar reservas por fecha de entrada
router.get("/entrada/:fecha", reservaController.obtenerReservaPorFechaEntrada);

// Buscar reservas por apellido del huésped
router.get("/apellido/:apellido", reservaController.obtenerReservaPorApellido);

// Buscar reservas por nombre de empresa
router.get("/empresa/:empresa", reservaController.obtenerReservaPorEmpresa);

// Registrar una línea de reserva dentro de una reserva
router.post("/:id/lineas", reservaController.registrarLineaEnReserva);

// Obtener todas las líneas de una reserva
router.get("/:id/lineas", reservaController.obtenerLineasDeReserva);

// Modificar una línea de reserva concreta
router.put("/:id/lineas/:id_linea", reservaController.modificarLineaReserva);

// Anular una línea de reserva
router.delete("/:id/lineas/:id_linea", reservaController.anularLineaReserva);

// Obtener el historial de una reserva
router.get("/:id/historial", reservaController.obtenerHistorialReserva);

// Obtener una reserva de check-in por número de habitación
router.get("/habitacion/:numero/check-in", reservaController.obtenerReservaActivaPorHabitacion);

// Obtener todas las reservas asignadas entre fechas
router.get("/asignadas", reservaController.obtenerReservasAsignadasEntreFechas);

// Comprobar si una reserva tiene líneas no facturadas
router.get("/:id_reserva/tiene-lineas-no-facturadas", reservaController.tieneLineasNoFacturadas);

// Exporta el router para su uso en la aplicación principal
module.exports = router;
