const { Op } = require("sequelize");
const Reserva = require("../models/Reserva");

class GestorReservas {
  // Crear una nueva reserva
  static async crearReserva(datos) {
    try {
      const nuevaReserva = await Reserva.create(datos);
      return nuevaReserva;
    } catch (error) {
      throw new Error("Error al crear la reserva: " + error.message);
    }
  }

  // Modificar los datos generales de una reserva
  static async modificarReserva(id, nuevosDatos) {
    try {
      // Que no se pueda cambiar el estado de la reserva
      if ("estado" in nuevosDatos) {
        throw new Error(
          "El campo 'estado' solo puede modificarse desde el endpoint específico"
        );
      }

      const reserva = await Reserva.findByPk(id);
      if (!reserva) throw new Error("Reserva no encontrada");

      await reserva.update(nuevosDatos);
      return reserva;
    } catch (error) {
      throw new Error("Error al modificar la reserva: " + error.message);
    }
  }

  // Cambiar estado de reserva
  static async cambiarEstadoReserva(id, nuevoEstado) {
    try {
      const reserva = await Reserva.findByPk(id);
      if (!reserva) throw new Error("Reserva no encontrada");

      // Validar que el nuevo estado sea uno permitido
      const estadosValidos = ["Confirmada", "Anulada", "Check-in", "Check-out"];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(
          "Estado no válido. Debe ser: Confirmada, Anulada, Check-in o Check-out"
        );
      }

      reserva.estado = nuevoEstado;
      await reserva.save();

      return reserva;
    } catch (error) {
      throw new Error(
        "Error al cambiar el estado de la reserva: " + error.message
      );
    }
  }

  // Obtener una reserva por su ID
  static async obtenerReservaPorId(id) {
    try {
      const reserva = await Reserva.findByPk(id);
      if (!reserva) throw new Error("Reserva no encontrada");
      return reserva;
    } catch (error) {
      throw new Error("Error al obtener la reserva: " + error.message);
    }
  }

  // Buscar reservas por fecha de entrada exacta
  static async obtenerReservaPorFechaEntrada(fecha) {
    try {
      return await Reserva.findAll({
        where: { fecha_entrada: fecha },
      });
    } catch (error) {
      throw new Error("Error al buscar por fecha de entrada: " + error.message);
    }
  }

  // Buscar reservas por apellido del huésped (primer apellido del campo nombre_huesped)
  static async obtenerReservaPorApellido(apellido) {
    try {
      return await Reserva.findAll({
        where: {
          primer_apellido_huesped: { [Op.startsWith]: `%${apellido}%` },
        },
      });
    } catch (error) {
      throw new Error("Error al buscar por apellido: " + error.message);
    }
  }

  // Buscar reservas por nombre de empresa (también en nombre_huesped)
  static async obtenerReservaPorEmpresa(nombreEmpresa) {
    try {
      return await Reserva.findAll({
        where: {
          nombre_huesped: { [Op.like]: `%${nombreEmpresa}%` },
        },
      });
    } catch (error) {
      throw new Error("Error al buscar por empresa: " + error.message);
    }
  }
}

module.exports = GestorReservas;
