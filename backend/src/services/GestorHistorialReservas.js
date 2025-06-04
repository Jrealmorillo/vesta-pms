const HistorialReserva = require("../models/HistorialReserva");
const { Usuario } = require("../models");


class GestorHistorialReservas {
  async registrarAccionHistorial({ id_reserva, nombre_usuario, accion, detalles = null }) {
    try {
      // Crea un nuevo registro en el historial de la reserva con los datos proporcionados
      const nuevoRegistro = await HistorialReserva.create({
        id_reserva, // ID de la reserva afectada
        nombre_usuario, // Usuario que realiza la acción
        accion, // Descripción de la acción realizada
        detalles, // Detalles adicionales (opcional)
      });

      return nuevoRegistro;
    } catch (error) {
      throw new Error("Error al registrar historial de reserva: " + error.message);
    }
  }


  async obtenerHistorialReserva(id_reserva) {
    try {
      // Busca todos los registros de historial para la reserva indicada, ordenados por fecha descendente
      return await HistorialReserva.findAll({
        where: { id_reserva }, // Filtra por la reserva solicitada
        order: [["fecha_accion", "DESC"]], // Ordena del más reciente al más antiguo
      });
    } catch (error) {
      throw new Error("Error al obtener historial: " + error.message);
    }
  }

}

module.exports = new GestorHistorialReservas();
