const express = require("express");
const usuarioController = require("../controllers/usuarioController");

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/registro", usuarioController.registrarUsuario);
router.get("/", usuarioController.obtenerusuarios);
router.get("/:id", usuarioController.obtenerusuarioPorId);
router.delete("/:id", usuarioController.desactivarUsuario)
router.put("/:id", usuarioController.modificarUsuario);

module.exports = router;