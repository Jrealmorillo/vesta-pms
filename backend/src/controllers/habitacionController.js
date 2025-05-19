// Controlador para gestionar las operaciones relacionadas con habitaciones.
// Utiliza el servicio GestorHabitaciones para la lógica de negocio y responde a las peticiones HTTP.

const GestorHabitaciones = require("../services/GestorHabitaciones");

 // Registra una nueva habitación con los datos recibidos en el cuerpo de la petición
exports.registrarHabitacion = async (req, res) => {
  try {
   // Devuelve la habitación creada y un mensaje de éxito/error 
    const habitacion = await GestorHabitaciones.registrarHabitacion(req.body);
    res.status(201).json({ mensaje: "Habitacion registrada correctamente", habitacion });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar la habitación: ",
      detalle: error.message,
    });
  }
};

 // Modifica una habitación existente identificada por su número
exports.modificarHabitacion = async (req, res) => {
  try {
     // Devuelve la habitación modificada y un mensaje de éxito/error
    const habitacion = await GestorHabitaciones.modificarHabitacion(
      req.params.numero,
      req.body
    );
    res.json({ mensaje: `Habitación ${habitacion} actualizada correctamente `, habitacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

 // Elimina la habitación identificada por su número
exports.eliminarHabitacion = async (req, res) => {
  try {
    // Elimina la habitación y devuelve un mensaje de éxito/error
    const habitacion = await GestorHabitaciones.eliminarHabitacion(
      req.params.numero
    );
    res.json({ mensaje: `Habitación ${habitacion} eliminada correctamente `, habitacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Obtiene la lista de todas las habitaciones registradas
exports.obtenerHabitaciones = async (req, res) => {
  try {
    // Devuelve la lista de habitaciones y un mensaje de éxito/error
    const habitaciones = await GestorHabitaciones.obtenerHabitaciones();
    res.json({ mensaje: "Lista de habitaciones obtenida correctamente", habitaciones });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las habitaciones" });
  }
};

// Obtiene la información de una habitación por su número
exports.obtenerHabitacionPorNumero = async (req, res) => {
  try {
    // Devuelve la información de la habitación y un mensaje de éxito/error
    const habitacion = await GestorHabitaciones.obtenerHabitacionPorNumero(
      req.params.numero
    );
    res.json({ mensaje: `Habitación ${habitacion} obtenida correctamente`, habitacion });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
