// Controlador para gestionar los detalles de factura y operaciones relacionadas con cargos y facturación.
// Utiliza el servicio GestorDetalleFactura y los modelos para la lógica de negocio y responde a las peticiones HTTP.

const { LineaReserva, DetalleFactura, Factura } = require("../models");
const { Op } = require("sequelize");
const GestorDetalleFactura = require("../services/GestorDetalleFactura");
const GestorFacturas = require("../services/GestorFacturas");

exports.registrarDetalle = async (req, res) => {
  try {
    // Registra un nuevo detalle de factura con los datos recibidos
    const detalle = await GestorDetalleFactura.registrarDetalleFactura(req.body);

    // Si el detalle está asociado a una factura, recalcular el total automáticamente
    if (detalle.id_factura) {
      await GestorFacturas.recalcularTotalFactura(detalle.id_factura);
    }

    // Devuelve el detalle creado y un mensaje de éxito
    res.status(201).json({
      mensaje: "Detalle de factura registrado correctamente",
      detalle
    });
  } catch (error) {
    // Devuelve un error si la operación falla
    res.status(400).json({ error: error.message });
  }
};

exports.modificarDetalle = async (req, res) => {
  try {
    // Modifica un detalle de factura existente identificado por su ID
    const detalle = await GestorDetalleFactura.modificarDetalleFactura(
      req.params.id,
      req.body
    );

    // Si el detalle está asociado a una factura, recalcular el total automáticamente
    if (detalle.id_factura) {
      await GestorFacturas.recalcularTotalFactura(detalle.id_factura);
    }

    // Devuelve el detalle modificado y un mensaje de éxito
    res.json({
      mensaje: "Detalle de factura modificado correctamente",
      detalle
    });
  } catch (error) {
    // Devuelve un error si la modificación falla
    res.status(400).json({ error: error.message });
  }
};

exports.anularDetalle = async (req, res) => {
  try {
    // Obtener el detalle antes de anularlo para conocer su id_factura
    const detalleAntes = await GestorDetalleFactura.obtenerDetallePorId(req.params.id);

    // Marca el detalle como anulado en la base de datos
    const resultado = await GestorDetalleFactura.anularDetalleFactura(req.params.id);

    // Si el detalle estaba asociado a una factura, recalcular el total automáticamente
    if (detalleAntes && detalleAntes.id_factura) {
      await GestorFacturas.recalcularTotalFactura(detalleAntes.id_factura);
    }

    res.json(resultado);
  } catch (error) {
    // Devuelve un error si la anulación falla
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerPendientesPorReserva = async (req, res) => {
  try {
    // Obtiene los detalles de factura pendientes asociados a una reserva
    const detalles = await GestorDetalleFactura.obtenerDetallesPendientesPorReserva(
      req.params.id_reserva
    );
    res.json(detalles);
  } catch (error) {
    // Devuelve un error si la consulta falla
    res.status(400).json({ error: error.message });
  }
};

exports.adelantarCargosDesdeLineas = async (req, res) => {
  try {
    const id_reserva = req.params.id_reserva;
    // Comprueba si la reserva tiene una factura ya cerrada (Pagada)
    const facturaExistente = await Factura.findOne({
      where: { id_reserva, estado: "Pagada" }
    });
    if (facturaExistente) {
      // Si ya hay una factura pagada, no se pueden adelantar cargos
      throw new Error("No se pueden adelantar cargos: la factura ya está cerrada");
    }
    // Comprueba si ya se han adelantado cargos automáticos para esta reserva
    const detallesYaVolcados = await DetalleFactura.findAll({
      where: {
        id_reserva,
        id_factura: null,
        concepto: { [Op.like]: "Alojamiento%" }, // para distinguir cargos automáticos
        activa: true
      }
    });
    if (detallesYaVolcados.length > 0) {
      // Si ya existen, no se vuelven a adelantar
      return res.status(400).json({
        detalle: "Ya se han adelantado los cargos de esta reserva"
      });
    }
    // Obtiene todas las líneas activas de la reserva
    const lineas = await LineaReserva.findAll({
      where: { id_reserva, activa: true },
    });
    if (lineas.length === 0) {
      // Si no hay líneas activas, devuelve error
      return res.status(404).json({ error: "No hay líneas activas para esta reserva" });
    }
    let creados = [];
    // Por cada línea activa, crea un nuevo detalle de factura automático
    for (const linea of lineas) {
      const total = (linea.precio * linea.cantidad_habitaciones).toFixed(2);
      const detalle = await GestorDetalleFactura.registrarDetalleFactura({
        id_reserva,
        concepto: `Alojamiento - ${linea.tipo_habitacion} (${linea.regimen})`,
        cantidad: linea.cantidad_habitaciones,
        precio_unitario: linea.precio,
        total,
        fecha: linea.fecha,
      });
      creados.push(detalle);
    }
    // Devuelve el resultado de la operación
    res.json({
      mensaje: "Cargos adelantados correctamente",
      detalles_creados: creados.length,
    });
  } catch (error) {
    // Devuelve un error si la operación falla
    res.status(500).json({ error: "Error al adelantar cargos", detalle: error.message });
  }
};

