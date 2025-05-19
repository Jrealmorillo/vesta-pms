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

      // Actualiza el precio total de la reserva sumando el importe de la nueva línea
      const reserva = await Reserva.findByPk(datos.id_reserva);
      if (reserva) {
        const incremento =
          parseFloat(nuevaLinea.precio) * nuevaLinea.cantidad_habitaciones; // Importe de la nueva línea
        const totalAnterior = parseFloat(reserva.precio_total);
        reserva.precio_total = (totalAnterior + incremento).toFixed(2); // Nuevo total
        await reserva.save();
      }

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

      // Actualiza el total de la reserva restando el importe de la línea anulada
      const reserva = await Reserva.findByPk(linea.id_reserva);
      if (reserva) {
        const decremento =
          parseFloat(linea.precio) * linea.cantidad_habitaciones;
        const totalAnterior = parseFloat(reserva.precio_total);
        const nuevoTotal = Math.max(0, totalAnterior - decremento).toFixed(2);

        reserva.precio_total = nuevoTotal;
        await reserva.save();
      }

      // Elimina la línea de la base de datos
      await linea.destroy();

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
      if (lineas.length === 0) {
        throw new Error("No se encontraron líneas para la reserva especificada"); // Validación de existencia
      }
      return lineas;
    } catch (error) {
      throw new Error("Error al obtener líneas de reserva: " + error.message);
    }
  }
}

module.exports = new GestorLineasReserva();
