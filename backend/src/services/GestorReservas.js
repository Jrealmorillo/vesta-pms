const { Op } = require("sequelize");
const { Reserva, Cliente, Empresa, LineaReserva } = require("../models");
const GestorLineasReserva = require("./GestorLineasReserva");
const GestorHistorialReservas = require("./GestorHistorialReservas");

class GestorReservas {
  // Crear una nueva reserva
  async crearReserva(datos, nombre_usuario) {
    const { lineasReserva, ...datosReserva } = datos;

    try {
      if (!Array.isArray(lineasReserva) || lineasReserva.length === 0) {
        throw new Error("Debe incluir al menos una línea de reserva");
      }

      // Comprobamos que las fechas de entrada y salida no son anteriores a la actual
      // y que la salida no es anterior a la entrada
      const entrada = new Date(datosReserva.fecha_entrada);
      const salida = new Date(datosReserva.fecha_salida);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (entrada < hoy) {
        throw new Error("La fecha de entrada no puede ser anterior a la fecha actual.");
      }

      if (salida <= entrada) {
        throw new Error("La fecha de salida debe ser posterior a la fecha de entrada.");
      }

      // Crear la reserva principal
      const nuevaReserva = await Reserva.create({
        ...datosReserva,
        precio_total: 0,
      });

      // Registrar acción en el historial
      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: nuevaReserva.id_reserva,
        nombre_usuario,
        accion: "Creación",
        detalles:
          "Reserva creada manualmente con " + lineasReserva.length + " líneas.",
      });

      // Registrar cada línea asociada y acumular precios
      for (const linea of lineasReserva) {

        const fechaLinea = new Date(linea.fecha);

        // Validar que la fecha esté dentro del rango permitido
        if (fechaLinea < entrada || fechaLinea >= salida) {
          throw new Error(
            `La línea con fecha ${linea.fecha} está fuera del rango de estancia. Debe estar entre ${datosReserva.fecha_entrada} y ${datosReserva.fecha_salida}.`
          );
        }


        await GestorLineasReserva.registrarLineaReserva(
          {
            ...linea,
            id_reserva: nuevaReserva.id_reserva,
          },
          nombre_usuario
        );

        const incremento = parseFloat(linea.precio) * linea.cantidad_habitaciones;
        const totalAnterior = parseFloat(nuevaReserva.precio_total);
        nuevaReserva.precio_total = (totalAnterior + incremento).toFixed(2);
        // Importante guardar el nuevo valor
        await nuevaReserva.save();
      }

      // Obtener las líneas recién creadas
      const lineasCreadas = await GestorLineasReserva.obtenerLineasPorReserva(
        nuevaReserva.id_reserva
      );

      // Devolver reserva y sus líneas
      return {
        reserva: nuevaReserva,
        lineasReserva: lineasCreadas,
      };
    } catch (error) {
      throw new Error("Error al crear la reserva: " + error.message);
    }
  }

  // Modificar los datos generales de una reserva
  async modificarReserva(id, nuevosDatos, nombre_usuario) {
    try {
      if ("estado" in nuevosDatos) {
        throw new Error(
          "El campo 'estado' solo puede modificarse desde el endpoint específico"
        );
      }

      const reserva = await Reserva.findByPk(id);
      if (!reserva) throw new Error("Reserva no encontrada");

      const valoresAnteriores = { ...reserva.dataValues }; // 🔐 guardar estado original

      // Obtener fechas actualizadas (antes del update)
      const nuevaEntrada = nuevosDatos.fecha_entrada || reserva.fecha_entrada;
      const nuevaSalida = nuevosDatos.fecha_salida || reserva.fecha_salida;

      const entrada = new Date(nuevaEntrada);
      const salida = new Date(nuevaSalida);

      // Obtener líneas activas
      const lineas = await LineaReserva.findAll({
        where: {
          id_reserva: id,
          activa: true
        }
      });

      // Detectar líneas fuera del nuevo rango
      const lineasFueraDeRango = lineas.filter(linea => {
        const fechaLinea = new Date(linea.fecha);
        return fechaLinea < entrada || fechaLinea >= salida;
      });

      // Desactivar líneas fuera de rango y registrar historial por cada una
      for (const linea of lineasFueraDeRango) {
        await linea.destroy();

        await GestorHistorialReservas.registrarAccionHistorial({
          id_reserva: reserva.id_reserva,
          nombre_usuario,
          accion: "Modificación",
          detalles: `Línea de reserva desactivada (fuera del rango): ${linea.tipo_habitacion} (${linea.fecha})`
        });
      }

      // Actualizar reserva con nuevos datos
      await reserva.update(nuevosDatos);

      // Comparar cambios reales
      let cambios = [];
      for (const campo in nuevosDatos) {
        const valorAnterior = valoresAnteriores[campo];
        const valorNuevo = nuevosDatos[campo];
        if (
          valorAnterior !== undefined &&
          valorNuevo !== undefined &&
          valorAnterior != valorNuevo
        ) {
          cambios.push(
            `Campo '${campo}' cambiado de '${valorAnterior}' a '${valorNuevo}'`
          );
        }
      }

      if (lineasFueraDeRango.length > 0) {
        cambios.push(
          `Se desactivaron ${lineasFueraDeRango.length} línea(s) fuera del nuevo rango de fechas.`
        );
      }

      const descripcionCambios =
        cambios.length > 0
          ? cambios.join("; ")
          : "Modificación realizada sin cambios significativos";

      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: reserva.id_reserva,
        nombre_usuario,
        accion: "Modificación",
        detalles: descripcionCambios
      });

      return reserva;
    } catch (error) {
      throw new Error("Error al modificar la reserva: " + error.message);
    }
  }


  // Cambiar estado de reserva
  async cambiarEstadoReserva(id, nuevoEstado, nombre_usuario) {
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

      // Registrar acción en el historial
      await GestorHistorialReservas.registrarAccionHistorial({
        id_reserva: reserva.id_reserva,
        nombre_usuario,
        accion: nuevoEstado,
        detalles: `Reserva cambiada a estado "${nuevoEstado}".`,
      });

      return reserva;
    } catch (error) {
      throw new Error(
        "Error al cambiar el estado de la reserva: " + error.message
      );
    }
  }

  // Obtener una reserva por su ID
  async obtenerReservaPorId(id) {
    try {
      const reserva = await Reserva.findByPk(id, {
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" },
        ],
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      return reserva;
    } catch (error) {
      throw new Error("Error al obtener la reserva: " + error.message);
    }
  }

  // Buscar reservas por fecha de entrada exacta
  async obtenerReservaPorFechaEntrada(fecha) {
    try {
      return await Reserva.findAll({
        where: { fecha_entrada: fecha },
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" },
        ],
      });
    } catch (error) {
      throw new Error("Error al buscar por fecha de entrada: " + error.message);
    }
  }

  // Buscar reservas por apellido del huésped (primer apellido del campo nombre_huesped)
  async obtenerReservaPorApellido(apellido) {
    try {
      return await Reserva.findAll({
        where: {
          primer_apellido_huesped: {
            [Op.startsWith]: apellido,
          },
        },
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" },
        ],
      });
    } catch (error) {
      throw new Error("Error al buscar por apellido: " + error.message);
    }
  }

  // Buscar reservas por nombre de empresa (también en nombre_huesped)
  async obtenerReservaPorEmpresa(nombre) {
    try {
      return await Reserva.findAll({
        include: [
          {
            model: Empresa,
            as: "empresa",
            where: {
              nombre: {
                [Op.like]: `%${nombre}%`,
              },
            },
          },
          { model: Cliente, as: "cliente" },
          { model: LineaReserva, as: "lineas" },
        ],
      });
    } catch (error) {
      throw new Error("Error al buscar por empresa: " + error.message);
    }
  }
}

module.exports = new GestorReservas();
