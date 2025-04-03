const HistorialReserva = require("../models/HistorialReserva");
const { Usuario } = require("../models");


class GestorHistorialReservas {
  async registrarAccionHistorial({ id_reserva, nombre_usuario, accion, detalles = null }) {
    try {
      const nuevoRegistro = await HistorialReserva.create({
        id_reserva,
        nombre_usuario,
        accion,
        detalles,
      });

      return nuevoRegistro;
    } catch (error) {
      throw new Error("Error al registrar historial de reserva: " + error.message);
    }
  }


  async obtenerHistorialReserva(id_reserva) {
    try {
      return await HistorialReserva.findAll({
        where: { id_reserva },
        order: [["fecha_accion", "DESC"]],
      });
    } catch (error) {
      throw new Error("Error al obtener historial: " + error.message);
    }
  }
  
}

module.exports = new GestorHistorialReservas();
