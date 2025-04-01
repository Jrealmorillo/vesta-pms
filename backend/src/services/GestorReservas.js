const { Op } = require("sequelize");
const { Reserva, Cliente, Empresa, LineaReserva } = require("../models");
const GestorLineasReserva = require("./GestorLineasReserva");

class GestorReservas {
  // Crear una nueva reserva
  async crearReserva(datos) {
    const { lineasReserva, ...datosReserva } = datos;

    try {
      if (!Array.isArray(lineasReserva) || lineasReserva.length === 0) {
        throw new Error("Debe incluir al menos una línea de reserva");
      }
      
      // Crear la reserva principal 
      const nuevaReserva = await Reserva.create({
        ...datosReserva,
        precio_total: 0
      });

      // Registrar cada línea asociada y acumular precios
      for (const linea of lineasReserva) {
        await GestorLineasReserva.registrarLineaReserva({
          ...linea,
          id_reserva: nuevaReserva.id_reserva,
        });
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
  async modificarReserva(id, nuevosDatos) {
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
  async cambiarEstadoReserva(id, nuevoEstado) {
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
  async obtenerReservaPorId(id) {
    try {
      const reserva = await Reserva.findByPk(id, {
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" }
        ]
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
          { model: LineaReserva, as: "lineas" }
        ]
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
            [Op.startsWith]: apellido
          }
        },
        include: [
          { model: Cliente, as: "cliente" },
          { model: Empresa, as: "empresa" },
          { model: LineaReserva, as: "lineas" }
        ]
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
                [Op.like]: `%${nombre}%`
              }
            }
          },
          { model: Cliente, as: "cliente" },
          { model: LineaReserva, as: "lineas" }
        ]
      });
    } catch (error) {
      throw new Error("Error al buscar por empresa: " + error.message);
    }
  }
}

module.exports = new GestorReservas();
