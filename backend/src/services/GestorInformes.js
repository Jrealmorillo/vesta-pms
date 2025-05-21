const { LineaReserva, Habitacion, Reserva, Factura, Cliente } = require("../models");
const { Op } = require("sequelize");

class GestorInformes {
    async obtenerOcupacionEntreFechas(desde, hasta) {
        try {
            // Contar todas las habitaciones que NO están bloqueadas
            const totalHabitacionesDisponibles = await Habitacion.count();

            // Buscar líneas activas dentro del rango con reservas válidas
            const lineas = await LineaReserva.findAll({
                where: {
                    fecha: { [Op.between]: [desde, hasta] },
                    activa: true,
                },
                include: [
                    {
                        model: Reserva,
                        as: "reserva",
                        where: {
                            estado: { [Op.in]: ["Confirmada", "Check-in"] },
                        },
                        required: true,
                    },
                ],
            });

            const resumen = {};

            for (const linea of lineas) {
                const fecha = linea.fecha;
                if (!resumen[fecha]) {
                    resumen[fecha] = {
                        habitaciones_ocupadas: 0,
                        adultos: 0,
                        ninos: 0,
                        huespedes: 0,
                        habitaciones_disponibles: totalHabitacionesDisponibles,
                    };
                }

                const habitaciones = parseInt(linea.cantidad_habitaciones || 0);
                const adultos = parseInt(linea.cantidad_adultos || 0);
                const ninos = parseInt(linea.cantidad_ninos || 0);

                resumen[fecha].habitaciones_ocupadas += habitaciones;
                resumen[fecha].adultos += adultos;
                resumen[fecha].ninos += ninos;
                resumen[fecha].huespedes += adultos + ninos;
            }

            for (const fecha in resumen) {
                const total = resumen[fecha].habitaciones_disponibles || 1;
                resumen[fecha].porcentaje_ocupacion = Math.round(
                    (resumen[fecha].habitaciones_ocupadas / total) * 100
                );
            }

            return resumen;
        } catch (error) {
            throw new Error("Error al calcular ocupación: " + error.message);
        }
    }


    async obtenerFacturacionPorFecha(fecha) {
        try {
            const facturas = await Factura.findAll({
                where: {
                    fecha_emision: {
                        [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`]
                    }
                },
                include: [
                    { model: Cliente, as: "cliente", required: false },
                    { model: Reserva, as: "reserva", required: false }
                ],
                order: [["id_factura", "ASC"]]
            });

            return facturas;
        } catch (error) {
            throw new Error("Error al obtener facturación diaria: " + error.message);
        }
    }

    async  obtenerFacturacionEntreFechas(desde, hasta) {
  try {
    const facturas = await Factura.findAll({
      where: {
        fecha_emision: {
          [Op.between]: [`${desde} 00:00:00`, `${hasta} 23:59:59`]
        }
      },
      order: [["fecha_emision", "ASC"]],
    });

    // Agrupar por día y forma de pago
    const resumen = {};

    for (const factura of facturas) {
      const fecha = factura.fecha_emision.toISOString().split("T")[0];
      const formaPago = factura.forma_pago || "Sin especificar";
      const total = parseFloat(factura.total || 0);

      if (!resumen[fecha]) {
        resumen[fecha] = {};
      }

      if (!resumen[fecha][formaPago]) {
        resumen[fecha][formaPago] = 0;
      }

      resumen[fecha][formaPago] += total;
    }

    return resumen;
  } catch (error) {
    throw new Error("Error al obtener facturación entre fechas: " + error.message);
  }
}
}


module.exports = new GestorInformes();
