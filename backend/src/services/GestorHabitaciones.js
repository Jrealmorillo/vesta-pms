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
      const habitacion = await Habitacion.findByPk(numero_habitacion);
      if (!habitacion) {
        throw new Error("Habitación no encontrada");
      }
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
      const habitaciones = await Habitacion.findAll();
      if (habitaciones.length === 0) {
        throw new Error("No hay habitaciones registradas");
      }
      return habitaciones;
    } catch (error) {
      throw new Error("Error al obtener las habitaciones: " + error.message);
    }
  }

  // Obtener una habitación concreta
  async obtenerHabitacionPorNumero(numero_habitacion) {
    try {
      const habitacion = await Habitacion.findByPk(numero_habitacion);
      if (!habitacion) throw new Error("Habitación no encontrada");
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
