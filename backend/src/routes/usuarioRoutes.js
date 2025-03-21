const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");
const verifyRol = require("../middlewares/roleMiddleware");

const router = express.Router();

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", usuarioController.loginUsuario);

// Ruta para registrar un nuevo usuario
router.post("/registro", authMiddleware, verifyRol(1), usuarioController.registrarUsuario);

// Ruta para obtener todos los usuarios
router.get("/", authMiddleware, verifyRol(1), usuarioController.obtenerusuarios);

// Ruta para obtener un usuario por su ID
router.get("/:id", authMiddleware, verifyRol(1), usuarioController.obtenerusuarioPorId);

// Ruta para desactivar un usuario por su ID
router.delete("/:id", authMiddleware, verifyRol(1), usuarioController.desactivarUsuario);

// Ruta para modificar los datos de un usuario
router.put("/:id", authMiddleware, verifyRol(1), usuarioController.modificarUsuario);

// Ruta para cambiar la contraseña de un usuario
router.put("/:id/cambiar-password", authMiddleware, usuarioController.cambiarPassword);


module.exports = router;
