const GestorHabitaciones = require("../services/GestorHabitaciones");

exports.registrarHabitacion = async (req, res) => {
  try {
    const habitacion = await GestorHabitaciones.registrarHabitacion(req.body);
    res
      .status(201)
      .json({ mensaje: "Habitacion registrada correctamente", habitacion });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al registrar la habitación: ",
        detalle: error.message,
      });
  }
};

exports.modificarHabitacion = async (req, res) => {
  try {
    const habitacion = await GestorHabitaciones.modificarHabitacion(
      req.params.numero,
      req.body
    );
    res.json({ mensaje: "Habitación actualizada correctamente ", habitacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.eliminarHabitacion = async (req, res) => {
  try {
    const habitacion = await GestorHabitaciones.eliminarHabitacion(
      req.params.numero
    );
    res.json(habitacion);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.obtenerHabitaciones = async (req, res) => {
  try {
    const habitaciones = await GestorHabitaciones.obtenerHabitaciones();
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las habitaciones" });
  }
};

exports.obtenerHabitacionPorNumero = async (req, res) => {
  try {
    const habitacion = await GestorHabitaciones.obtenerHabitacionPorNumero(
      req.params.numero
    );
    res.json(habitacion);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
