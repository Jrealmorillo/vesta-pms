const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/registro", usuarioController.registrarUsuario);
router.get("/", authMiddleware, usuarioController.obtenerusuarios);
router.get("/:id", usuarioController.obtenerusuarioPorId);
router.delete("/:id", usuarioController.desactivarUsuario)
router.put("/:id", usuarioController.modificarUsuario);
router.put("/:id/cambiar-password", usuarioController.cambiarPassword);
router.post("/login", usuarioController.loginUsuario);


module.exports = router;