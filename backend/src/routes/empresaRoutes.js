// Rutas para operaciones relacionadas con empresas.
// Aplica el middleware de autenticación a todas las rutas y conecta cada endpoint con su controlador correspondiente.

// Importaciones necesarias para crear las rutas
const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresaController");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica el middleware de autenticación JWT a todas las rutas de este router
router.use(authMiddleware);

// Ruta para registrar una nueva empresa
router.post("/registro", empresaController.registrarEmpresa);

// Ruta para modificar datos de una empresa existente
router.put("/:id", empresaController.modificarEmpresa);

// Rutas para buscar empresas por ID, CIF o nombre
router.get("/id/:filtro", empresaController.buscarEmpresasPorId);
router.get("/cif/:filtro", empresaController.buscarEmpresasPorCif);
router.get("/nombre/:filtro", empresaController.buscarEmpresasPorNombre);

// Exporta el router para su uso en la aplicación principal
module.exports = router;