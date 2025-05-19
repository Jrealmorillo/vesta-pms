// Rutas para operaciones relacionadas con habitaciones.
// Aplica el middleware de autenticación a todas las rutas y restringe las operaciones críticas a administradores.

// Importaciones necesarias para crear las rutas
const express = require("express");
const habitacionController = require("../controllers/habitacionController");
const authMiddleware = require("../middlewares/authMiddleware");
// 1 = Adminisrador, 2 = usuario
const verifyRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Aplica el middleware de autenticación JWT a todas las rutas de este router
router.use(authMiddleware);

// Ruta para registrar una habitación (solo administradores)
router.post("/registro", verifyRole(1), habitacionController.registrarHabitacion);

// Ruta para modificar los datos de una habitación (solo administradores)
router.put("/:numero", verifyRole(1), habitacionController.modificarHabitacion);

// Ruta para eliminar una habitación (solo administradores)
router.delete("/:numero", verifyRole(1), habitacionController.eliminarHabitacion);

// Ruta para obtener todas las habitaciones (acceso general)
router.get("/", habitacionController.obtenerHabitaciones);

// Ruta para obtener una habitación por número (acceso general)
router.get("/:numero", habitacionController.obtenerHabitacionPorNumero);

// Exporta el router para su uso en la aplicación principal
module.exports = router;
