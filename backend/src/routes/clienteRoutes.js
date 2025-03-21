const express = require("express");
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Aplicar el middleware de autenticación a todas las rutas de este router
router.use(authMiddleware);

//Ruta para registrar un nuevo cliente
router.post("/registro", clienteController.registrarCliente);


// Ruta para modificar un cliente
router.put("/:id", clienteController.modificarCliente);

// Rutas para buscar clientes por Id, número de documento o apellido
router.get("/id/:filtro", clienteController.buscarClientesPorId);
router.get("/documento/:filtro", clienteController.buscarClientesPorNumeroDocumento);
router.get("/apellido/:filtro", clienteController.buscarClientesPorApellido);


module.exports = router;