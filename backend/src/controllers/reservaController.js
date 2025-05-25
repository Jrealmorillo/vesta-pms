// Controlador para gestionar las operaciones relacionadas con reservas y sus líneas.
// Utiliza los servicios GestorReservas, GestorLineasReserva y GestorHistorialReservas para la lógica de negocio y responde a las peticiones HTTP.

const GestorReservas = require("../services/GestorReservas");
const GestorLineasReserva = require("../services/GestorLineasReserva");
const GestorHistorialReservas = require("../services/GestorHistorialReservas");

// Recibe los datos de la reserva y sus líneas, y la registra en la base de datos.
exports.crearReserva = async (req, res) => {
  try {
    // Extrae el usuario autenticado que realiza la operación
    const usuario = req.usuario.nombre_usuario;
    // Separa las líneas de reserva del resto de datos
    const { lineas, ...datosReserva } = req.body;
    // Llama al servicio para crear la reserva y sus líneas asociadas
    const { reserva, lineasReserva } = await GestorReservas.crearReserva(
      {
        ...datosReserva,
        lineasReserva: lineas,
      }, usuario);
    // Devuelve la reserva y las líneas creadas
    res.status(201).json({
      mensaje: "Reserva creada exitosamente",
      reserva,
      lineasReserva
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualiza los datos de una reserva identificada por su ID.
exports.modificarReserva = async (req, res) => {
  try {
    // Usuario autenticado
    const usuario = req.usuario.nombre_usuario;
    // Actualiza la reserva con los nuevos datos
    const reservaActualizada = await GestorReservas.modificarReserva(
      req.params.id,
      req.body,
      usuario
    );
    res.json({
      mensaje: "Reserva actualizada correctamente",
      reserva: reservaActualizada
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Cambia el estado de la reserva (Confirmada, Anulada, etc.)
exports.cambiarEstado = async (req, res) => {
  try {
    // Valida que se haya enviado un nuevo estado
    const { nuevoEstado } = req.body;
    if (!nuevoEstado) {
      return res.status(400).json({ error: "Debe proporcionar un nuevo estado" });
    }
    // Usuario autenticado
    const usuario = req.usuario.nombre_usuario;
    // Cambia el estado de la reserva
    const reserva = await GestorReservas.cambiarEstadoReserva(
      req.params.id,
      nuevoEstado,
      usuario
    );
    res.json({
      mensaje: `Estado de la reserva actualizado a ${nuevoEstado}`,
      reserva
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Devuelve la reserva correspondiente al ID proporcionado.
exports.obtenerReservaPorId = async (req, res) => {
  try {
    // Busca la reserva por su ID
    const reserva = await GestorReservas.obtenerReservaPorId(req.params.id);
    res.json(reserva);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


// Buscar por fecha de entrada proporcionada
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
    // Usuario autenticado
    const usuario = req.usuario.nombre_usuario;
    // Prepara los datos de la línea de reserva
    const datos = {
      ...req.body,
      id_reserva: req.params.id // Se añade automáticamente desde la ruta
    };
    // Llama al servicio para registrar la línea de reserva
    const linea = await GestorLineasReserva.registrarLineaReserva(datos, usuario);
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
    // Usuario autenticado
    const usuario = req.usuario.nombre_usuario;
    // Llama al servicio para modificar la línea de reserva
    const linea = await GestorLineasReserva.modificarLineaReserva(
      req.params.id_linea,
      req.body,
      usuario
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
    // Usuario autenticado
    const usuario = req.usuario.nombre_usuario;
    // Llama al servicio para anular la línea de reserva
    const resultado = await GestorLineasReserva.anularLineaReserva(
      req.params.id_linea,
      usuario
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
    // Busca todas las líneas de la reserva especificada
    const lineas = await GestorLineasReserva.obtenerLineasPorReserva(
      req.params.id
    );
    res.json(lineas);
  } catch (error) {
    const status = error.message.includes("no se encontraron") ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
};

// Obtener el historial de una reserva
exports.obtenerHistorialReserva = async (req, res) => {
  try {
    // Obtiene el historial de la reserva especificada
    const historial = await GestorHistorialReservas.obtenerHistorialReserva(req.params.id);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial", detalles: error.message });
  }
};

// Obtener una reserva activa (check-in) por número de habitación
exports.obtenerReservaActivaPorHabitacion = async (req, res) => {
  try {
    // Busca la reserva activa por el número de habitación
    const reserva = await GestorReservas.obtenerReservaActivaPorHabitacion(req.params.numero);
    // Verifica si hay alguna factura pagada
    const estado_factura = reserva.facturas?.some(f => f.estado === "Pagada")
      ? "Pagada"
      : "Pendiente";
    res.json({
      ...reserva.dataValues,
      estado_factura,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Obtener habitaciones asignadas entre dos fechas  
exports.obtenerReservasAsignadasEntreFechas = async (req, res) => {
  try {
    // Valida que se hayan proporcionado las fechas requeridas
    const { desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: "Debe especificar 'desde' y 'hasta'" });
    }
    // Obtiene las reservas dentro del rango de fechas
    const reservas = await GestorReservas.obtenerReservasAsignadasEntreFechas(desde, hasta);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las reservas asignadas" });
  }
};

// Verificar si hay líneas de reserva no facturadas
exports.tieneLineasNoFacturadas = async (req, res) => {
  try {
    // Verifica si la reserva tiene líneas no facturadas
    const resultado = await GestorReservas.tieneLineasNoFacturadas(req.params.id_reserva);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




