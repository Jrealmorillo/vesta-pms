const GestorReservas = require("../services/GestorReservas");

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
  try {
    const nuevaReserva = await GestorReservas.crearReserva(req.body);
    res.status(201).json({
      mensaje: "Reserva creada exitosamente",
      reserva: nuevaReserva
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
        mensaje: `Estado de la reserva actualizado a "${nuevoEstado}"`,
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
    const reservas = await GestorReservas.buscarPorFechaEntrada(req.params.fecha);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por apellido del huésped
exports.obtenerReservaPorApellido = async (req, res) => {
  try {
    const reservas = await GestorReservas.buscarPorApellido(req.params.apellido);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por nombre de empresa
exports.obtenerReservaPorEmpresa = async (req, res) => {
  try {
    const reservas = await GestorReservas.buscarPorEmpresa(req.params.empresa);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
