// services/GestorLineasReserva.js
const LineaReserva = require("../models/LineaReserva");
const Reserva = require("../models/Reserva");

class GestorLineasReserva {
  // Registrar una nueva línea de reserva
  async registrarLineaReserva(datos) {
    try {
      const nuevaLinea = await LineaReserva.create(datos);

      // Actualizar el precio total de la reserva
      const reserva = await Reserva.findByPk(datos.id_reserva);
      if (reserva) {
        const incremento =
          parseFloat(nuevaLinea.precio) * nuevaLinea.cantidad_habitaciones;
        const totalAnterior = parseFloat(reserva.precio_total);
        reserva.precio_total = (totalAnterior + incremento).toFixed(2);
        await reserva.save();
      }
      return nuevaLinea;
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

      // btener la reserva relacionada
      const reserva = await Reserva.findByPk(linea.id_reserva);

      // Calcular el importe original antes del cambio
      const importeAnterior =
        parseFloat(linea.precio) * linea.cantidad_habitaciones;

      // Actualizar la línea con los nuevos datos
      await linea.update(nuevosDatos);

      // Comprobar si se modificó precio o cantidad_habitaciones
      if ("precio" in nuevosDatos || "cantidad_habitaciones" in nuevosDatos) {
        const nuevoPrecio = parseFloat(linea.precio);
        const nuevaCantidad = linea.cantidad_habitaciones;
        const nuevoImporte = nuevoPrecio * nuevaCantidad;

        const totalActual = parseFloat(reserva.precio_total);
        const nuevoTotal = (
          totalActual -
          importeAnterior +
          nuevoImporte
        ).toFixed(2);

        reserva.precio_total = nuevoTotal;
        await reserva.save();
      }

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

      // Restar el importe de esta línea del total de la reserva
      const reserva = await Reserva.findByPk(linea.id_reserva);
      if (reserva) {
        const decremento =
          parseFloat(linea.precio) * linea.cantidad_habitaciones;
        const totalAnterior = parseFloat(reserva.precio_total);
        const nuevoTotal = Math.max(0, totalAnterior - decremento).toFixed(2);

        reserva.precio_total = nuevoTotal;
        await reserva.save();
      }

      // Eliminar la línea de reserva
      await linea.destroy();

      return { mensaje: "Línea de reserva eliminada correctamente" };
    } catch (error) {
      throw new Error(
        "Error al eliminar la línea de reserva: " + error.message
      );
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
