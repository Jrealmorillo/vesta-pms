const GestorFacturas = require("../services/GestorFacturas");

exports.crearFactura = async (req, res) => {
  try {
    const datos = req.body;
    const factura = await GestorFacturas.crearFactura(datos);
    res.status(201).json({
      mensaje: "Factura creada correctamente",
      factura
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await GestorFacturas.obtenerFacturaPorId(req.params.id);
    res.json(factura);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.modificarFactura = async (req, res) => {
  try {
    const factura = await GestorFacturas.modificarFactura(req.params.id, req.body);
    res.json({
      mensaje: "Factura modificada correctamente",
      factura
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.anularFactura = async (req, res) => {
  try {
    const factura = await GestorFacturas.anularFactura(req.params.id);
    res.json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.buscarFacturas = async (req, res) => {
  try {
    const filtros = req.query; // Los filtros vienen por query string
    const resultados = await GestorFacturas.buscarFacturas(filtros);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

