const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/registro", usuarioController.registrarUsuario);

// Ruta para obtener todos los usuarios (requiere autenticación)
router.get("/", authMiddleware, usuarioController.obtenerusuarios);

// Ruta para obtener un usuario por su ID
router.get("/:id", usuarioController.obtenerusuarioPorId);

// Ruta para desactivar un usuario por su ID
router.delete("/:id", usuarioController.desactivarUsuario);

// Ruta para modificar los datos de un usuario
router.put("/:id", usuarioController.modificarUsuario);

// Ruta para cambiar la contraseña de un usuario
router.put("/:id/cambiar-password", usuarioController.cambiarPassword);

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", usuarioController.loginUsuario);

module.exports = router;
