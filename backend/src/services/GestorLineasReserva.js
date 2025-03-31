// services/GestorLineasReserva.js
const LineaReserva = require("../models/LineaReserva");

class GestorLineasReserva {
  // Registrar una nueva línea de reserva
  async registrarLineaReserva(datos) {
    try {
      return await LineaReserva.create(datos);
    } catch (error) {
      throw new Error("Error al registrar línea de reserva: " + error.message);
    }
  }

  // Modificar una línea de reserva existente
  async modificarLineaReserva(id, nuevosDatos) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) {
        throw new Error("Línea de reserva no encontrada");
      }
      await linea.update(nuevosDatos);
      return linea;
    } catch (error) {
      throw new Error(
        "Error al modificar la línea de reserva: " + error.message
      );
    }
  }

  // Anular una línea de reserva (marcar como inactiva)
  async anularLineaReserva(id) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) {
        throw new Error("Línea de reserva no encontrada");
      }
      await linea.update({ activa: false });
      return { mensaje: "Línea de reserva anulada correctamente" };
    } catch (error) {
      throw new Error("Error al anular la línea de reserva: " + error.message);
    }
  }

  // Obtener todas las líneas de una reserva específica
  async obtenerLineasPorReserva(id_reserva) {
    try {
      const lineas = await LineaReserva.findAll({
        where: { id_reserva },
      });
      if (lineas.length === 0) {
        throw new Error(
          "No se encontraron líneas para la reserva especificada"
        );
      }
      return lineas;
    } catch (error) {
      throw new Error("Error al obtener líneas de reserva: " + error.message);
    }
  }
}

module.exports = new GestorLineasReserva();
