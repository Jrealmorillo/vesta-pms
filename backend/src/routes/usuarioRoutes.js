// Rutas para operaciones relacionadas con usuarios.
// Aplica el middleware de autenticación y restricción de rol a las rutas críticas, y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

// 1 = Administrador, 2 = usuario
const verifyRole = require("../middlewares/roleMiddleware");


// Ruta para iniciar sesión y obtener un token JWT (acceso público)
router.post("/login", usuarioController.loginUsuario);

// Ruta para registrar un nuevo usuario (solo administradores)
router.post("/registro", authMiddleware, verifyRole(1), usuarioController.registrarUsuario);

// Ruta para obtener todos los usuarios (solo administradores)
router.get("/", authMiddleware, verifyRole(1), usuarioController.obtenerusuarios);

// Ruta para obtener un usuario por su ID (solo administradores)
router.get("/:id", authMiddleware, verifyRole(1), usuarioController.obtenerusuarioPorId);

// Ruta para desactivar un usuario por su ID (solo administradores)
router.delete("/:id", authMiddleware, verifyRole(1), usuarioController.desactivarUsuario);

// Ruta para modificar los datos de un usuario (solo administradores)
router.put("/:id", authMiddleware, verifyRole(1), usuarioController.modificarUsuario);

// Ruta para cambiar la contraseña de un usuario (usuario autenticado)
router.put("/:id/cambiar-password", authMiddleware, usuarioController.cambiarPassword);

// Exporta el router para su uso en la aplicación principal
module.exports = router;
