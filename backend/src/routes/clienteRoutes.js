// Rutas para operaciones relacionadas con clientes.
// Aplica el middleware de autenticación a todas las rutas y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica el middleware de autenticación JWT a todas las rutas de este router
router.use(authMiddleware);

// Ruta para registrar un nuevo cliente
router.post("/registro", clienteController.registrarCliente);

// Ruta para modificar un cliente existente
router.put("/:id", clienteController.modificarCliente);

// Rutas para buscar clientes por ID, número de documento, apellido o nombre
router.get("/id/:filtro", clienteController.buscarClientesPorId);
router.get("/documento/:filtro", clienteController.buscarClientesPorNumeroDocumento);
router.get("/apellido/:filtro", clienteController.buscarClientesPorApellido);
router.get("/nombre/:filtro", clienteController.buscarClientesPorNombre);

// Exporta el router para su uso en la aplicación principal
module.exports = router;