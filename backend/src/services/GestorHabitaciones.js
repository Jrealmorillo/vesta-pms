const Habitacion = require("../models/Habitacion");

class GestorHabitaciones {
  // Crear una nueva habitación
  async registrarHabitacion(datos) {
    try {
      const habitacion = await Habitacion.create(datos);
      return habitacion;
    } catch (error) {
      throw new Error(
        `Error al crear la habitación nº ${datos.numero_habitacion}: ` +
        error.message
      );
    }
  }

  // Modificar los datos de una habitación
  async modificarHabitacion(numero_habitacion, nuevosDatos) {
    try {
      const habitacion = await Habitacion.findByPk(numero_habitacion);
      if (!habitacion) {
        throw new Error("Habitación no encontrada");
      }
      await habitacion.update(nuevosDatos);
      return habitacion;
    } catch (error) {
      throw new Error(
        `Error al modificar la habitación nº ${numero_habitacion}: ` +
        error.message
      );
    }
  }

  // Eliminar una habitación
  async eliminarHabitacion(numero_habitacion) {
    try {
      // Buscar la habitación por su número único
      const habitacion = await Habitacion.findByPk(numero_habitacion);
      if (!habitacion) {
        throw new Error("Habitación no encontrada"); // Validación de existencia
      }
      // Eliminar la habitación de la base de datos
      await habitacion.destroy();
      return {
        mensaje: `Habitación ${numero_habitacion} eliminada correctamente`,
      };
    } catch (error) {
      throw new Error(
        `Error al eliminar la habitación nº ${numero_habitacion}: ` +
        error.message
      );
    }
  }

  // Obtener todas las habitaciones
  async obtenerHabitaciones() {
    try {
      // Recupera todas las habitaciones registradas
      const habitaciones = await Habitacion.findAll();
      if (habitaciones.length === 0) {
        throw new Error("No hay habitaciones registradas"); // Validación si no hay datos
      }
      return habitaciones;
    } catch (error) {
      throw new Error("Error al obtener las habitaciones: " + error.message);
    }
  }

  // Obtener una habitación concreta
  async obtenerHabitacionPorNumero(numero_habitacion) {
    try {
      // Busca la habitación por su número único (clave primaria)
      const habitacion = await Habitacion.findByPk(numero_habitacion);
      if (!habitacion) throw new Error("Habitación no encontrada"); // Validación de existencia
      return habitacion;
    } catch (error) {
      throw new Error(
        `Error al obtener la habitación nº ${numero_habitacion}: ` +
        error.message
      );
    }
  }
}

module.exports = new GestorHabitaciones();
