// Controlador para gestionar las operaciones relacionadas con empresas.
// Utiliza el servicio GestorEmpresas para la lógica de negocio y responde a las peticiones HTTP.

const GestorEmpresas = require("../services/GestorEmpresas");

// Registra una nueva empresa con los datos recibidos en el cuerpo de la petición
exports.registrarEmpresa = async (req, res) => {
  try {
    const empresa = await GestorEmpresas.registrarEmpresa(req.body);
    // Devuelve la empresa creada y un mensaje de éxito
    res.status(201).json({ mensaje: "Empresa registrada exitosamente", empresa });
  } catch (error) {
    // Devuelve un error detallado si la operación falla
    res.status(500).json({ error: "Error al registrar empresa", detalle: error.message });
  }
};

// Modifica una empresa existente identificada por su ID
exports.modificarEmpresa = async (req, res) => {
  try {
    const empresa = await GestorEmpresas.modificarEmpresa(
      req.params.id,
      req.body
    );
    // Devuelve la empresa modificada y un mensaje de éxito
    res.json({ mensaje: "Empresa actualizada correctamente", empresa });
  } catch (error) {
    // Devuelve un error si la empresa no se encuentra
    res.status(404).json({ error: error.message });
  }
};

// Busca empresas por ID, CIF o nombre usando el filtro recibido por parámetro
// Devuelve las empresas que coinciden con el filtro proporcionado

// Busca empresas por ID
exports.buscarEmpresasPorId = async (req, res) => {
  try {
    const empresas = await GestorEmpresas.buscarEmpresasPorId(req.params.filtro);
    res.json(empresas);
  } catch (error) {
    // Devuelve un error si no se encuentran empresas
    res.status(404).json({ error: error.message });
  }
};

// Busca empresas por CIF
exports.buscarEmpresasPorCif = async (req, res) => {
  try {
    const empresas = await GestorEmpresas.buscarEmpresasPorCif(
      req.params.filtro
    );
    res.json(empresas);
  } catch (error) {
    // Devuelve un error si no se encuentran empresas
    res.status(404).json({ error: error.message });
  }
};

// Busca empresas por nombre
exports.buscarEmpresasPorNombre = async (req, res) => {
  try {
    
    const empresas = await GestorEmpresas.buscarEmpresasPorNombre(
      req.params.filtro
    );
    res.json(empresas);
  } catch (error) {
    // Devuelve un error si no se encuentran empresas
    res.status(404).json({ error: error.message });
  }
};
