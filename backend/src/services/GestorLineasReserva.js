// services/GestorLineasReserva.js
const LineaReserva = require("../models/LineaReserva");
const Reserva = require("../models/Reserva");
const GestorHistorialReservas = require("./GestorHistorialReservas");

class GestorLineasReserva {
  // Registrar una nueva línea de reserva
  async registrarLineaReserva(datos, nombre_usuario) {
    try {
      // Crea una nueva línea de reserva con los datos recibidos
      const nuevaLinea = await LineaReserva.create(datos);

      // Recalcula el precio total de la reserva sumando todas las líneas activas
      const id_reserva = datos.id_reserva;
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

      // Registra la acción en el historial de la reserva
      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: datos.id_reserva,
        nombre_usuario,
        accion: "Modificada",
        detalles: `Línea añadida: ${datos.tipo_habitacion} (${datos.fecha}), ${datos.cantidad_habitaciones} habs, ${datos.precio} €/noche`,
      });

      return nuevaLinea;
    } catch (error) {
      throw new Error("Error al registrar línea de reserva: " + error.message);
    }
  }

  // Modificar una línea de reserva existente
  async modificarLineaReserva(id, nuevosDatos, nombre_usuario) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) throw new Error("Línea de reserva no encontrada");

      // Actualiza los campos de la línea de reserva
      await linea.update(nuevosDatos);

      // Recalcula el total de la reserva sumando todas las líneas activas
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

      // Detecta y describe los cambios realizados en la línea
      let cambios = [];
      for (const campo in nuevosDatos) {
        const valorAnterior = linea[campo];
        const valorNuevo = nuevosDatos[campo];

        if (
          valorAnterior !== undefined && // El campo existe en la línea original
          valorNuevo !== undefined && // El campo está presente en los nuevos datos
          valorAnterior != valorNuevo // El valor ha cambiado realmente
        ) {
          // Añade una descripción del cambio detectado
          cambios.push(`Campo '${campo}' cambiado de '${valorAnterior}' a '${valorNuevo}'`);
        }
      }

      // Construye la descripción de los cambios para el historial
      const descripcionCambios = cambios.length > 0
        ? `Línea modificada: ${cambios.join("; ")}` // Lista de cambios detectados
        : "Modificación de línea sin cambios detectables"; // Si no se detectaron cambios

      // Registra la modificación en el historial de la reserva
      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva, // ID de la reserva afectada
        nombre_usuario, // Usuario que realiza la acción
        accion: "Modificada", // Tipo de acción
        detalles: descripcionCambios // Descripción de los cambios
      });

      return linea;
    } catch (error) {
      throw new Error("Error al modificar la línea de reserva: " + error.message);
    }
  }

  // Anular línea de reserva
  async anularLineaReserva(id, nombre_usuario) {
    try {
      const linea = await LineaReserva.findByPk(id);
      if (!linea) throw new Error("Línea de reserva no encontrada");

      // Elimina la línea de la base de datos
      await linea.destroy();

      // Recalcula el total de la reserva sumando todas las líneas activas
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

      // Registra la eliminación en el historial
      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: linea.id_reserva,
        nombre_usuario,
        accion: "Modificada",
        detalles: `Línea eliminada: ${linea.tipo_habitacion} (${linea.fecha})`
      });

      return { mensaje: "Línea de reserva eliminada correctamente" };
    } catch (error) {
      throw new Error("Error al eliminar la línea de reserva: " + error.message);
    }
  }

  // Obtener líneas de reserva por ID de reserva
  async obtenerLineasPorReserva(id_reserva) {
    try {
      // Busca todas las líneas asociadas a la reserva indicada
      const lineas = await LineaReserva.findAll({
        where: { id_reserva },
      });
      // Si no hay líneas devolvemos el array vacío
      return lineas;
    } catch (error) {
      throw new Error("Error al obtener líneas de reserva: " + error.message);
    }
  }
}

module.exports = new GestorLineasReserva();
