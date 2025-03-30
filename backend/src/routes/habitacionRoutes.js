const express = require("express");
const habitacionController = require("../controllers/habitacionController");
const authMiddleware = require("../middlewares/authMiddleware");
// 1 = Adminisrador, 2 = usuario
const verifyRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Aplicamos el middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Ruta para registrar una habitación
router.post("/registro", verifyRole(1), habitacionController.registrarHabitacion);

// Ruta para modificar los datos de una habitación
router.put("/:numero", verifyRole(1), habitacionController.modificarHabitacion);

// Ruta para eliminar una habitación
router.delete("/:numero", verifyRole(1), habitacionController.eliminarHabitacion);

// Ruta para obtener todas las habitaciones
router.get("/", habitacionController.obtenerHabitaciones);

// Ruta para obtener una habitación
router.get("/:numero", habitacionController.obtenerHabitacionPorNumero);

module.exports = router;
