const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

// 1 = Adminisrador, 2 = usuario
const verifyRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Ruta para iniciar sesión y obtener un token JWT
router.post("/login", usuarioController.loginUsuario);

// Ruta para registrar un nuevo usuario
router.post("/registro", authMiddleware, verifyRole(1), usuarioController.registrarUsuario);

// Ruta para obtener todos los usuarios
router.get("/", authMiddleware, verifyRole(1), usuarioController.obtenerusuarios);

// Ruta para obtener un usuario por su ID
router.get("/:id", authMiddleware, verifyRole(1), usuarioController.obtenerusuarioPorId);

// Ruta para desactivar un usuario por su ID
router.delete("/:id", authMiddleware, verifyRole(1), usuarioController.desactivarUsuario);

// Ruta para modificar los datos de un usuario
router.put("/:id", authMiddleware, verifyRole(1), usuarioController.modificarUsuario);

// Ruta para cambiar la contraseña de un usuario
router.put("/:id/cambiar-password", authMiddleware, usuarioController.cambiarPassword);


module.exports = router;
