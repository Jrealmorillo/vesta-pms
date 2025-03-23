const GestorEmpresas = require("../services/GestorEmpresas");

// Registrar una nueva empresa
exports.registrarEmpresa = async (req, res) => {
  try {
    const empresa = await GestorEmpresas.registrarEmpresa(req.body);
    res
      .status(201)
      .json({ mensaje: "Empresa registrada exitosamente", empresa });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al registrar empresa", detalle: error.message });
  }
};

// Modificar una empresa
exports.modificarEmpresa = async (req, res) => {
  try {
    const empresa = await GestorEmpresas.modificarEmpresa(
      req.params.id,
      req.body
    );
    res.json({ mensaje: "Empresa actualizada correctamente", empresa });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 🔍 Buscar empresas por ID
exports.buscarEmpresasPorId = async (req, res) => {
  try {
    const empresas = await GestorEmpresas.buscarEmpresasPorId(req.params.filtro);
    res.json(empresas);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 🔍 Buscar empresas por CIF
exports.buscarEmpresasPorCif = async (req, res) => {
  try {
    const empresas = await GestorEmpresas.buscarEmpresasPorCif(
      req.params.filtro
    );
    res.json(empresas);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// 🔍 Buscar empresas por nombre
exports.buscarEmpresasPorNombre = async (req, res) => {
  try {
    const empresas = await GestorEmpresas.buscarEmpresasPorNombre(
      req.params.filtro
    );
    res.json(empresas);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
