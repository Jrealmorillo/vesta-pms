const GestorReservas = require("../services/GestorReservas");
const GestorLineasReserva = require("../services/GestorLineasReserva");


// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  try {
    const {reserva, lineasReserva} = await GestorReservas.crearReserva(req.body);
    res.status(201).json({
      mensaje: "Reserva creada exitosamente",
      reserva,
      lineasReserva
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar reserva
exports.modificarReserva = async (req, res) => {
    try {
      const reservaActualizada = await GestorReservas.modificarReserva(
        req.params.id,
        req.body
      );
      res.json({
        mensaje: "Reserva actualizada correctamente",
        reserva: reservaActualizada
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };
  
  // Cambiar estado de una reserva
  exports.cambiarEstado = async (req, res) => {
    try {
      const { nuevoEstado } = req.body;
      if (!nuevoEstado) {
        return res.status(400).json({ error: "Debe proporcionar un nuevo estado" });
      }
  
      const reserva = await GestorReservas.cambiarEstadoReserva(
        req.params.id,
        nuevoEstado
      );
      res.json({
        mensaje: `Estado de la reserva actualizado a ${nuevoEstado}`,
        reserva
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Obtener reserva por ID
exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await GestorReservas.obtenerReservaPorId(req.params.id);
    res.json(reserva);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


// Buscar por fecha de entrada
exports.obtenerReservaPorFechaEntrada = async (req, res) => {
  try {
    const reservas = await GestorReservas.obtenerReservaPorFechaEntrada(req.params.fecha);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por apellido del huésped
exports.obtenerReservaPorApellido = async (req, res) => {
  try {
    const reservas = await GestorReservas.obtenerReservaPorApellido(req.params.apellido);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por nombre de empresa
exports.obtenerReservaPorEmpresa = async (req, res) => {
  try {
    const reservas = await GestorReservas.obtenerReservaPorEmpresa(req.params.empresa);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar una nueva línea de reserva dentro de una reserva
exports.registrarLineaEnReserva = async (req, res) => {
  try {
    const datos = {
      ...req.body,
      id_reserva: req.params.id // Se añade automáticamente desde la ruta
    };

    const linea = await GestorLineasReserva.registrarLineaReserva(datos);
    res.status(201).json({
      mensaje: "Línea de reserva registrada correctamente",
      linea
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Modificar una línea de reserva existente
exports.modificarLineaReserva = async (req, res) => {
  try {
    const linea = await GestorLineasReserva.modificarLineaReserva(
      req.params.id_linea,
      req.body
    );
    res.json({
      mensaje: "Línea de reserva modificada correctamente",
      linea
    });
  } catch (error) {
    const status = error.message.includes("no encontrada") ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};

// Anular (desactivar) una línea de reserva
exports.anularLineaReserva = async (req, res) => {
  try {
    const resultado = await GestorLineasReserva.anularLineaReserva(
      req.params.id_linea
    );
    res.json(resultado);
  } catch (error) {
    const status = error.message.includes("no encontrada") ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};

// Obtener todas las líneas de una reserva específica
exports.obtenerLineasDeReserva = async (req, res) => {
  try {
    const lineas = await GestorLineasReserva.obtenerLineasPorReserva(
      req.params.id
    );
    res.json(lineas);
  } catch (error) {
    const status = error.message.includes("no se encontraron") ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};
