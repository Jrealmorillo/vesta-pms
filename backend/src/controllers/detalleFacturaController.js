
const { LineaReserva, DetalleFactura, Factura } = require("../models");
const { Op } = require("sequelize");
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


exports.adelantarCargosDesdeLineas = async (req, res) => {

  // Esta función toma las líneas activas de una reserva y las convierte en detalles de factura
  try {
    const id_reserva = req.params.id_reserva;
    // Comprobar si la reserva tiene una factura ya cerrada
    const facturaExistente = await Factura.findOne({
      where: { id_reserva, estado: "Pagada" }
    });

    if (facturaExistente) {
      throw new Error("No se pueden adelantar cargos: la factura ya está cerrada");
    }
    // Comprobar si ya se han adelantado cargos para esta reserva
    const detallesYaVolcados = await DetalleFactura.findAll({
      where: {
        id_reserva,
        id_factura: null,
        concepto: { [Op.like]: "Alojamiento%" }, // para distinguir cargos automáticos
        activa: true
      }
    });
    if (detallesYaVolcados.length > 0) {
      return res.status(400).json({
        detalle: "Ya se han adelantado los cargos de esta reserva"
      });
    }
    

    // Obtener todas las líneas activas de la reserva
    const lineas = await LineaReserva.findAll({
      where: { id_reserva, activa: true },
    });

    if (lineas.length === 0) {
      return res.status(404).json({ error: "No hay líneas activas para esta reserva" });
    }

    let creados = [];

    // Volcar cada línea como un nuevo detalle de factura
    for (const linea of lineas) {
      const total = (linea.precio * linea.cantidad_habitaciones).toFixed(2);

      const detalle = await GestorDetalleFactura.registrarDetalleFactura({
        id_reserva,
        concepto: `Alojamiento - ${linea.tipo_habitacion} (${linea.regimen})`,
        cantidad: linea.cantidad_habitaciones,
        precio_unitario: linea.precio,
        total,
      });

      creados.push(detalle);
    }

    res.json({
      mensaje: "Cargos adelantados correctamente",
      detalles_creados: creados.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al adelantar cargos", detalle: error.message });
  }
};

