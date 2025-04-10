const GestorDetalleFactura = require("../services/GestorDetalleFactura");

exports.registrarDetalle = async (req, res) => {
  try {
    const detalle = await GestorDetalleFactura.registrarDetalleFactura(req.body);
    res.status(201).json({
      mensaje: "Detalle de factura registrado correctamente",
      detalle
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modificarDetalle = async (req, res) => {
  try {
    const detalle = await GestorDetalleFactura.modificarDetalleFactura(
      req.params.id,
      req.body
    );
    res.json({
      mensaje: "Detalle de factura modificado correctamente",
      detalle
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.anularDetalle = async (req, res) => {
  try {
    const resultado = await GestorDetalleFactura.anularDetalleFactura(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerPendientesPorReserva = async (req, res) => {
  try {
    const detalles = await GestorDetalleFactura.obtenerDetallesPendientesPorReserva(
      req.params.id_reserva
    );
    res.json(detalles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
