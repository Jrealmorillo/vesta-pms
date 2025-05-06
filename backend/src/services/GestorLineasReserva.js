// services/GestorLineasReserva.js
const LineaReserva = require("../models/LineaReserva");
const Reserva = require("../models/Reserva");
const GestorHistorialReservas = require("./GestorHistorialReservas");

class GestorLineasReserva {
  // Registrar una nueva línea de reserva
  async registrarLineaReserva(datos, nombre_usuario) {
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

      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: datos.id_reserva,
        nombre_usuario,
        accion: "Modificación",
        detalles: `Línea añadida: ${datos.tipo_habitacion} (${datos.fecha}), ${datos.cantidad_habitaciones} habs, ${datos.precio} €/noche`,
      });

      return nuevaLinea;
    } catch (error) {
      throw new Error("Error al registrar línea de reserva: " + error.message);
    }
  }

  // 🔁 Método completamente corregido
  async modificarLineaReserva(id, nuevosDatos, nombre_usuario) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) throw new Error("Línea de reserva no encontrada");

      // Guardar cambios
      await linea.update(nuevosDatos);

      // ✅ Recalcular el total de la reserva sumando todas las líneas activas
      const id_reserva = linea.id_reserva;
      const lineasActivas = await LineaReserva.findAll({
        where: { id_reserva, activa: true },
      });

      const nuevoTotal = lineasActivas.reduce((suma, l) => {
        return suma + (parseFloat(l.precio) * l.cantidad_habitaciones);
      }, 0);

      await Reserva.update(
        { precio_total: nuevoTotal.toFixed(2) },
        { where: { id_reserva } }
      );

      // Registrar cambios en historial
      let cambios = [];
      for (const campo in nuevosDatos) {
        const valorAnterior = linea[campo];
        const valorNuevo = nuevosDatos[campo];

        if (
          valorAnterior !== undefined &&
          valorNuevo !== undefined &&
          valorAnterior != valorNuevo
        ) {
          cambios.push(`Campo '${campo}' cambiado de '${valorAnterior}' a '${valorNuevo}'`);
        }
      }

      const descripcionCambios = cambios.length > 0
        ? `Línea modificada: ${cambios.join("; ")}`
        : "Modificación de línea sin cambios detectables";

      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva,
        nombre_usuario,
        accion: "Modificación",
        detalles: descripcionCambios
      });

      return linea;
    } catch (error) {
      throw new Error("Error al modificar la línea de reserva: " + error.message);
    }
  }

  // Anular línea (sin tocar)
  async anularLineaReserva(id, nombre_usuario) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) throw new Error("Línea de reserva no encontrada");

      const reserva = await Reserva.findByPk(linea.id_reserva);
      if (reserva) {
        const decremento =
          parseFloat(linea.precio) * linea.cantidad_habitaciones;
        const totalAnterior = parseFloat(reserva.precio_total);
        const nuevoTotal = Math.max(0, totalAnterior - decremento).toFixed(2);

        reserva.precio_total = nuevoTotal;
        await reserva.save();
      }

      await linea.destroy();

      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: linea.id_reserva,
        nombre_usuario,
        accion: "Modificación",
        detalles: `Línea eliminada: ${linea.tipo_habitacion} (${linea.fecha})`
      });

      return { mensaje: "Línea de reserva eliminada correctamente" };
    } catch (error) {
      throw new Error("Error al eliminar la línea de reserva: " + error.message);
    }
  }

  async obtenerLineasPorReserva(id_reserva) {
    try {
      const lineas = await LineaReserva.findAll({
        where: { id_reserva },
      });
      if (lineas.length === 0) {
        throw new Error("No se encontraron líneas para la reserva especificada");
      }
      return lineas;
    } catch (error) {
      throw new Error("Error al obtener líneas de reserva: " + error.message);
    }
  }
}

module.exports = new GestorLineasReserva();
