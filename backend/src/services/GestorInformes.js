const { LineaReserva, Habitacion, Reserva, Factura, Cliente } = require("../models");
const { Op } = require("sequelize");

class GestorInformes {    async obtenerOcupacionEntreFechas(desde, hasta) {
        try {
            // Contar todas las habitaciones que NO están bloqueadas
            const totalHabitacionesDisponibles = await Habitacion.count();

            // Calcular días del período
            const fechaDesde = new Date(desde);
            const fechaHasta = new Date(hasta);
            const diasPeriodo = Math.ceil((fechaHasta - fechaDesde) / (1000 * 60 * 60 * 24)) + 1;

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

            const resumenPorFecha = {};
            let totalNochesOcupadas = 0;

            for (const linea of lineas) {
                const fecha = linea.fecha;
                if (!resumenPorFecha[fecha]) {
                    resumenPorFecha[fecha] = {
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

                resumenPorFecha[fecha].habitaciones_ocupadas += habitaciones;
                resumenPorFecha[fecha].adultos += adultos;
                resumenPorFecha[fecha].ninos += ninos;
                resumenPorFecha[fecha].huespedes += adultos + ninos;

                totalNochesOcupadas += habitaciones;
            }

            // Calcular porcentaje de ocupación promedio
            const nochesDisponibles = totalHabitacionesDisponibles * diasPeriodo;
            const porcentajeOcupacion = nochesDisponibles > 0 
                ? Math.round((totalNochesOcupadas / nochesDisponibles) * 100) 
                : 0;

            // Devolver resumen consolidado que espera el frontend
            return {
                total_habitaciones: totalHabitacionesDisponibles,
                dias_periodo: diasPeriodo,
                noches_ocupadas: totalNochesOcupadas,
                noches_disponibles: nochesDisponibles,
                porcentaje_ocupacion: porcentajeOcupacion,
                detalle_por_fecha: resumenPorFecha // Mantener detalle por si se necesita
            };
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


// Obtener cargos por habitación para una fecha específica
async obtenerCargosPendientesPorHabitacion(fecha) {
  try {
    const lineas = await LineaReserva.findAll({
      where: {
        fecha: fecha,
        activa: true,
      },
      include: [
        {
          model: Reserva,
          as: "reserva",
          where: {
            estado: "Check-in",
          },
        },
      ],
    });    return lineas.map((linea) => ({
      fecha: linea.fecha,
      id_reserva: linea.id_reserva,
      numero_habitacion: linea.reserva?.numero_habitacion ?? "No asignada",
      concepto: `Alojamiento - ${linea.tipo_habitacion} (${linea.regimen})`,
      cantidad: linea.cantidad_habitaciones,
      precio_unitario: linea.precio,
      total: parseFloat(linea.precio) * linea.cantidad_habitaciones,
    }));
  } catch (error) {
    throw new Error("Error al obtener cargos por habitación: " + error.message);
  }
}

// Estado actual de habitaciones
    async obtenerEstadoActualHabitaciones() {
        try {
            // Todas las habitaciones
            const habitaciones = await Habitacion.findAll();
            // Reservas activas (Check-in) con habitación asignada
            const reservas = await Reserva.findAll({
                where: {
                    estado: 'Check-in',
                    numero_habitacion: { [Op.ne]: null }
                },
                attributes: ['numero_habitacion']
            });
            const ocupadas = reservas.map(r => r.numero_habitacion);
            return habitaciones.map(h => ({
                numero_habitacion: h.numero_habitacion,
                tipo: h.tipo,
                estado: ocupadas.includes(h.numero_habitacion) ? 'Ocupada' : 'Libre',
                capacidad_maxima: h.capacidad_maxima,
                capacidad_minima: h.capacidad_minima,
                precio_oficial: h.precio_oficial
            }));
        } catch (error) {
            throw new Error('Error al obtener estado actual de habitaciones: ' + error.message);
        }
    }

    // Clientes alojados actualmente
    async obtenerClientesAlojadosActualmente() {
        try {
            // Reservas en estado Check-in
            const reservas = await Reserva.findAll({
                where: { estado: 'Check-in' },
                include: [{ model: Cliente, as: 'cliente' }]
            });
            return reservas.map(r => ({
                id_reserva: r.id_reserva,
                nombre_huesped: r.nombre_huesped,
                primer_apellido_huesped: r.primer_apellido_huesped,
                segundo_apellido_huesped: r.segundo_apellido_huesped,
                numero_habitacion: r.numero_habitacion,
                fecha_entrada: r.fecha_entrada,
                fecha_salida: r.fecha_salida,
                cliente: r.cliente
            }));
        } catch (error) {
            throw new Error('Error al obtener clientes alojados actualmente: ' + error.message);
        }
    }

    // Listado de llegadas por fecha
    async obtenerLlegadasPorFecha(fecha) {
        try {
            const reservas = await Reserva.findAll({
                where: { fecha_entrada: fecha, estado: { [Op.in]: ['Confirmada', 'Check-in'] } },
                include: [{ model: Cliente, as: 'cliente' }]
            });
            return reservas;
        } catch (error) {
            throw new Error('Error al obtener llegadas por fecha: ' + error.message);
        }
    }

    // Listado de salidas por fecha
    async obtenerSalidasPorFecha(fecha) {
        try {
            const reservas = await Reserva.findAll({
                where: { fecha_salida: fecha, estado: { [Op.in]: ['Check-in', 'Check-out'] } },
                include: [{ model: Cliente, as: 'cliente' }]
            });
            return reservas;
        } catch (error) {
            throw new Error('Error al obtener salidas por fecha: ' + error.message);
        }
    }

    // Resumen de actividad diaria (Informe de Día)
    async obtenerResumenActividadDiaria(fecha) {
        try {
            // Llegadas
            const llegadas = await Reserva.count({ where: { fecha_entrada: fecha, estado: { [Op.in]: ['Confirmada', 'Check-in'] } } });
            // Salidas
            const salidas = await Reserva.count({ where: { fecha_salida: fecha, estado: { [Op.in]: ['Check-in', 'Check-out'] } } });
            // Ocupadas
            const ocupadas = await Reserva.count({ where: { estado: 'Check-in' } });
            // Libres
            const total = await Habitacion.count();
            const libres = total - ocupadas;
            // Facturación del día
            const facturacion = await Factura.sum('total', { where: { fecha_emision: { [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`] } } });
            return { fecha, llegadas, salidas, ocupadas, libres, facturacion };
        } catch (error) {
            throw new Error('Error al obtener resumen de actividad diaria: ' + error.message);
        }
    }

    // Consumo por forma de pago
    async obtenerConsumoPorFormaPago(desde, hasta) {
        try {
            const facturas = await Factura.findAll({
                where: { fecha_emision: { [Op.between]: [`${desde} 00:00:00`, `${hasta} 23:59:59`] } },
                attributes: ['forma_pago', 'total']
            });
            const resumen = {};
            for (const f of facturas) {
                const forma = f.forma_pago || 'Sin especificar';
                if (!resumen[forma]) resumen[forma] = 0;
                resumen[forma] += parseFloat(f.total || 0);
            }
            return resumen;
        } catch (error) {
            throw new Error('Error al obtener consumo por forma de pago: ' + error.message);
        }
    }
}


module.exports = new GestorInformes();
