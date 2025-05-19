// Controlador para gestionar las operaciones relacionadas con facturas.
// Utiliza el servicio GestorFacturas para la lógica de negocio y responde a las peticiones HTTP.

const GestorFacturas = require("../services/GestorFacturas");

// Recibe los datos de la factura y la registra en la base de datos.
exports.crearFactura = async (req, res) => {
  try {
    // Recoge los datos de la factura del cuerpo de la petición
    const datos = req.body;
    // Llama al servicio para crear la factura en la base de datos
    const factura = await GestorFacturas.crearFactura(datos);
    // Devuelve la factura creada y un mensaje de éxito
    res.status(201).json({
      mensaje: "Factura creada correctamente",
      factura
    });
  } catch (error) {
    // Devuelve un error si la creación falla
    res.status(400).json({ error: error.message });
  }
};


// Devuelve una factura registrada por su ID en la base de datos
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    // Busca la factura por su ID usando el servicio
    const factura = await GestorFacturas.obtenerFacturaPorId(req.params.id);
    // Si existe, la devuelve; si no, lanza error
    res.json(factura);
  } catch (error) {
    // Error si la factura no se encuentra
    res.status(404).json({ error: error.message });
  }
};

// Modifica una factura existente identificada por su ID
exports.modificarFactura = async (req, res) => {
  try {
    // Modifica una factura existente con los datos recibidos
    const factura = await GestorFacturas.modificarFactura(req.params.id, req.body);
    // Devuelve la factura modificada y un mensaje de éxito
    res.json({
      mensaje: "Factura modificada correctamente",
      factura
    });
  } catch (error) {
    // Devuelve un error si la modificación falla
    res.status(400).json({ error: error.message });
  }
};

// Elimina una factura identificada por su ID
exports.anularFactura = async (req, res) => {
  try {
    // Marca la factura como anulada en la base de datos
    const factura = await GestorFacturas.anularFactura(req.params.id);
    // Devuelve la factura anulada
    res.json(factura);
  } catch (error) {
    // Devuelve un error si la anulación falla
    res.status(400).json({ error: error.message });
  }
};

// Busca facturas en la base de datos según los filtros proporcionados
exports.buscarFacturas = async (req, res) => {
  try {
    // Recoge los filtros de búsqueda desde la query string
    const filtros = req.query;
    // Busca facturas que cumplan con los filtros proporcionados
    const resultados = await GestorFacturas.buscarFacturas(filtros);
    // Devuelve el listado de facturas encontradas
    res.json(resultados);
  } catch (error) {
    // Devuelve un error si la búsqueda falla
    res.status(500).json({ error: error.message });
  }
};

