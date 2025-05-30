const { Op } = require("sequelize");
const { Reserva, Cliente, Empresa, LineaReserva, Factura, Habitacion, DetalleFactura } = require("../models");
const GestorLineasReserva = require("./GestorLineasReserva");
const GestorHistorialReservas = require("./GestorHistorialReservas");
const GestorDetalleFactura = require("./GestorDetalleFactura");

class GestorReservas {


  // Función auxiliar para validar disponibilidad real de una habitación
  async validarDisponibilidadHabitacion(numero_habitacion, fecha_entrada, fecha_salida, idReservaActual = null) {
    // Verificar que la habitación existe
    const habitacion = await Habitacion.findByPk(numero_habitacion);
    if (!habitacion) {
      throw new Error(`La habitación nº ${numero_habitacion} no existe en el sistema`);
    }

    // Comprobar solapamientos con otras reservas activas en el mismo rango de fechas
    const conflictos = await Reserva.findAll({
      where: {
        numero_habitacion,
        estado: { [Op.ne]: "Anulada" }, // Solo reservas activas
        id_reserva: idReservaActual ? { [Op.ne]: idReservaActual } : { [Op.not]: null }, // Excluye la reserva actual si aplica
        fecha_entrada: { [Op.lt]: fecha_salida }, // Entrada antes de la salida solicitada
        fecha_salida: { [Op.gt]: fecha_entrada }  // Salida después de la entrada solicitada
      }
    });

    if (conflictos.length > 0) {
      throw new Error(`La habitación nº ${numero_habitacion} no está disponible en esas fechas`);
    }
  }

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

      // Validar que la habitación no esté ya asignada en otra reserva activa
      if (datosReserva.numero_habitacion) {
        await this.validarDisponibilidadHabitacion(
          datosReserva.numero_habitacion,
          datosReserva.fecha_entrada,
          datosReserva.fecha_salida
        );
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
        accion: "Confirmada",
        detalles:
          "Reserva creada manualmente con " + lineasReserva.length + " líneas.",
      });

      // Registrar cada línea asociada y acumular precios
      for (const linea of lineasReserva) {

        const fechaLinea = new Date(linea.fecha);

        // Validar que la fecha de la línea esté dentro del rango de la reserva
        if (fechaLinea < entrada || fechaLinea >= salida) {
          throw new Error(
            `La línea con fecha ${linea.fecha} está fuera del rango de estancia. Debe estar entre ${datosReserva.fecha_entrada} y ${datosReserva.fecha_salida}.`
          );
        }

        // Registrar la línea de reserva y asociarla a la reserva principal
        await GestorLineasReserva.registrarLineaReserva(
          {
            ...linea,
            id_reserva: nuevaReserva.id_reserva, // Relaciona la línea con la reserva creada
          },
          nombre_usuario
        );

        // Sumar el importe de la línea al total de la reserva
        const incremento = parseFloat(linea.precio) * linea.cantidad_habitaciones;
        const totalAnterior = parseFloat(nuevaReserva.precio_total);
        nuevaReserva.precio_total = (totalAnterior + incremento).toFixed(2);
        // Guardar el nuevo total acumulado
        await nuevaReserva.save();
      }

      // Obtener las líneas recién creadas para devolverlas junto a la reserva
      const lineasCreadas = await GestorLineasReserva.obtenerLineasPorReserva(
        nuevaReserva.id_reserva
      );

      // Devolver la reserva y sus líneas asociadas
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

      // guardar estado original
      const valoresAnteriores = { ...reserva.dataValues };

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
          accion: "Modificada",
          detalles: `Línea de reserva desactivada (fuera del rango): ${linea.tipo_habitacion} (${linea.fecha})`
        });
      }

      // Validar que la habitación no esté ya asignada en otra reserva activa
      if (nuevosDatos.numero_habitacion) {
        await this.validarDisponibilidadHabitacion(
          nuevosDatos.numero_habitacion,
          nuevaEntrada,
          nuevaSalida,
          id // Excluimos esta misma reserva
        );
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
        accion: "Modificada",
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

      // Comprobar que la habitación no esté ya asignada a otra reserva activa
      if (nuevoEstado === "Check-in") {
        if (!reserva.numero_habitacion) {
          throw new Error("No se puede hacer check-in: la reserva no tiene habitación asignada");
        }

        await this.validarDisponibilidadHabitacion(
          reserva.numero_habitacion,
          reserva.fecha_entrada,
          reserva.fecha_salida,
          reserva.id_reserva
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


  // Obtener una reserva de check-in por número de habitación
  async obtenerReservaActivaPorHabitacion(numeroHabitacion) {
    try {
      const reserva = await Reserva.findOne({
        where: {
          numero_habitacion: numeroHabitacion,
          estado: "Check-in"
        },
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" },
          {
            model: Factura,
            as: "facturas",
            required: false
          }
        ]
      });

      if (!reserva) {
        throw new Error("No hay reservas activas en esta habitación");
      }

      return reserva;
    } catch (error) {
      throw new Error("Error al obtener reserva activa por habitación: " + error.message);
    }
  }



  // Obtener todas las reservas asignadas entre dos fechas
  async obtenerReservasAsignadasEntreFechas(desde, hasta) {
    try {
       
      const reservas = await Reserva.findAll({
        where: {
          estado: {
            [Op.in]: ["Confirmada", "Check-in"]
          },
          numero_habitacion: {
            [Op.ne]: null
          },
          fecha_entrada: { [Op.lt]: hasta },
          fecha_salida: { [Op.gt]: desde }
        },
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" }
        ],
        order: [["numero_habitacion", "ASC"]],
      });
      return reservas;
    } catch (error) {
      throw new Error("Error al consultar reservas asignadas entre fechas");
    }
  }

  // Verificar si quedan líneas activas de reserva sin volcar a detalle de factura
  async tieneLineasNoFacturadas(id_reserva) {
    try {
      // Buscar líneas activas de tipo "Alojamiento"
      const lineas = await LineaReserva.findAll({
        where: {
          id_reserva,
          activa: true,
          tipo_habitacion: { [Op.ne]: null }
        }
      });      // Buscar TODOS los detalles de factura activos de la reserva (tanto pendientes como ya facturados) cuyo concepto sea alojamiento
      const detalles = await DetalleFactura.findAll({
        where: {
          id_reserva,
          activa: true,
          concepto: { [Op.like]: '%alojamiento%' }
        }
      });
      // Solo detalles de alojamiento
      const detallesAloj = detalles.filter((d) => d.concepto.toLowerCase().includes("alojamiento"));

      // Para cada línea activa, buscar si existe un detalle pendiente que coincida en fecha, tipo_habitacion y regimen
      let pendientes = false;
      for (const linea of lineas) {
        const existe = detallesAloj.some((detalle) => {
          // Extraer tipo y régimen del concepto del detalle
          // Ejemplo concepto: "Alojamiento - Doble (Media Pensión)"
          const match = detalle.concepto.match(/Alojamiento\s*-\s*(.+)\s*\((.+)\)/i);
          let tipo = null;
          let regimen = null;
          if (match) {
            tipo = match[1]?.trim();
            regimen = match[2]?.trim();
          }
          return (
            detalle.fecha === linea.fecha &&
            tipo === linea.tipo_habitacion &&
            regimen === linea.regimen &&
            detalle.cantidad === linea.cantidad_habitaciones &&
            parseFloat(detalle.precio_unitario) === parseFloat(linea.precio)
          );
        });
        if (!existe) {
          pendientes = true;
          break;
        }
      }
      return { pendientes };
    } catch (error) {
      throw new Error("Error al verificar líneas no facturadas: " + error.message);
    }
  }


}
module.exports = new GestorReservas();
