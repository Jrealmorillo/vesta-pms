const express = require("express");
const empresaController = require("../controllers/empresaController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Aplicar el middleware de autenticación a todas las rutas de este router
router.use(authMiddleware);

//Ruta para registrar una nueva empresa
router.post("/registro", empresaController.registrarEmpresa);


// Ruta para modificar datos de una empresa
router.put("/:id", empresaController.modificarEmpresa);

// Rutas para buscar empresas por Id, CIF o nombre
router.get("/id/:filtro", empresaController.buscarEmpresasPorId);
router.get("/cif/:filtro", empresaController.buscarEmpresasPorCif);
router.get("/nombre/:filtro", empresaController.buscarEmpresasPorNombre);


module.exports = router;