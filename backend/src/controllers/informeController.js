const GestorInformes = require("../services/GestorInformes");

exports.obtenerOcupacionEntreFechas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: "Debes especificar fecha 'desde' y 'hasta'" });
    }

    const resumen = await GestorInformes.obtenerOcupacionEntreFechas(desde, hasta);
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerFacturacionPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: "Debes especificar una fecha" });
    }

    const resultado = await GestorInformes.obtenerFacturacionPorFecha(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerFacturacionEntreFechas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: "Debes indicar 'desde' y 'hasta'" });
    }

    const resumen = await GestorInformes.obtenerFacturacionEntreFechas(desde, hasta);
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCargosPendientesPorHabitacion = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: "Debes indicar una fecha" });
    }

    const resultado = await GestorInformes.obtenerCargosPendientesPorHabitacion(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Estado actual de habitaciones
exports.obtenerEstadoActualHabitaciones = async (req, res) => {
  try {
    const resultado = await GestorInformes.obtenerEstadoActualHabitaciones();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clientes alojados actualmente
exports.obtenerClientesAlojadosActualmente = async (req, res) => {
  try {
    const resultado = await GestorInformes.obtenerClientesAlojadosActualmente();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listado de llegadas por fecha
exports.obtenerLlegadasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: "Debes indicar una fecha" });
    }
    const resultado = await GestorInformes.obtenerLlegadasPorFecha(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listado de salidas por fecha
exports.obtenerSalidasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: "Debes indicar una fecha" });
    }
    const resultado = await GestorInformes.obtenerSalidasPorFecha(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Resumen de actividad diaria
exports.obtenerResumenActividadDiaria = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: "Debes indicar una fecha" });
    }
    const resultado = await GestorInformes.obtenerResumenActividadDiaria(fecha);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consumo por forma de pago
exports.obtenerConsumoPorFormaPago = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: "Debes indicar 'desde' y 'hasta'" });
    }
    const resultado = await GestorInformes.obtenerConsumoPorFormaPago(desde, hasta);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// KPIs para dashboard (reales y previstos)
exports.obtenerKPIsDashboard = async (req, res) => {
  try {
    const models = require("../models");
    const { Op } = require("sequelize");
    
    // Fecha actual
    const hoy = new Date().toISOString().split('T')[0];
    
    // Total de habitaciones
    const total = await models.Habitacion.count();
    
    // Ocupación real: habitaciones con reservas en check-in
    const ocupadasReales = await models.Reserva.count({ where: { estado: "Check-in" } });
    const ocupacionReal = total > 0 ? Math.round((ocupadasReales / total) * 100) : 0;

    // Ocupación prevista: reservas que están activas hoy (entre fecha_entrada y fecha_salida)
    const ocupadasPrevistas = await models.Reserva.count({
      where: {
        estado: { [Op.in]: ["Confirmada", "Check-in"] },
        fecha_entrada: { [Op.lte]: hoy },
        fecha_salida: { [Op.gte]: hoy }
      }
    });
    const ocupacionPrevista = total > 0 ? Math.round((ocupadasPrevistas / total) * 100) : 0;    // Fechas para cálculos mensuales
    const now = new Date();
    const inicioMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    // Calcular el último día del mes correctamente
    const ultimoDiaDelMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const finMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(ultimoDiaDelMes).padStart(2, "0")}`;

    // Reservas de la semana actual (lunes a domingo)
    const fechaHoy = new Date();
    const diaSemana = fechaHoy.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    const inicioSemana = new Date(fechaHoy);
    inicioSemana.setDate(fechaHoy.getDate() - diasHastaLunes);
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    const reservasSemanales = await models.Reserva.count({
      where: {
        fecha_entrada: {
          [Op.between]: [inicioSemana.toISOString().split("T")[0], finSemana.toISOString().split("T")[0]]
        },
        estado: { [Op.in]: ["Confirmada", "Check-in", "Check-out"] }
      }
    });

    // Reservas del mes actual (con entrada en el mes)
    const reservasMensuales = await models.Reserva.count({
      where: {
        fecha_entrada: { [Op.between]: [inicioMes, finMes] },
        estado: { [Op.in]: ["Confirmada", "Check-in", "Check-out"] }
      }
    });    // Ingresos reales del mes actual (facturas emitidas)
    const ingresos = await models.Factura.sum("total", {
      where: {
        fecha_emision: { [Op.between]: [`${inicioMes} 00:00:00`, `${finMes} 23:59:59`] }
      }
    }) || 0;

    // Ingresos previstos: suma de líneas de reserva activas del mes actual
    // Solo líneas activas del mes actual, sin filtrar por estado de reserva por ahora
    const lineasPrevistos = await models.LineaReserva.findAll({
      where: {
        fecha: { [Op.between]: [inicioMes, finMes] },
        activa: true
      }
    });
    
    const ingresosPrevistos = lineasPrevistos.reduce((acc, l) => acc + (parseFloat(l.precio) * l.cantidad_habitaciones), 0);

    res.json({
      ocupacionReal,
      ocupacionPrevista,
      reservasSemanales,
      reservasMensuales,
      ingresos,
      ingresosPrevistos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ocupación semanal real y prevista
exports.obtenerOcupacionSemanal = async (req, res) => {
  try {
    const models = require("../models");
    const { Op } = require("sequelize");
    const hoy = new Date();
    const fechas = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - 6 + i);
      return d.toISOString().split("T")[0];
    });
    const total = await models.Habitacion.count();
    // Reales: check-in
    const reales = await Promise.all(fechas.map(async f => {
      const ocupadas = await models.Reserva.count({ where: { estado: "Check-in", fecha_entrada: f } });
      return total > 0 ? Math.round((ocupadas / total) * 100) : 0;
    }));
    // Previstas: confirmadas o check-in
    const previstas = await Promise.all(fechas.map(async f => {
      const ocupadas = await models.Reserva.count({ where: { estado: { [Op.in]: ["Confirmada", "Check-in"] }, fecha_entrada: f } });
      return total > 0 ? Math.round((ocupadas / total) * 100) : 0;
    }));
    res.json({ labels: fechas, reales, previstas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ingresos por mes: reales y previstos
exports.obtenerIngresosPorMes = async (req, res) => {
  try {
    const models = require("../models");
    const { Op } = require("sequelize");
    const hoy = new Date();
    const year = hoy.getFullYear();
    const meses = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    const labels = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // Reales: facturas emitidas
    const reales = await Promise.all(meses.map(async (mes) => {
      const desde = `${year}-${mes}-01`;
      const hasta = `${year}-${mes}-31`;
      const sum = await models.Factura.sum("total", {
        where: {
          fecha_emision: { [Op.between]: [`${desde} 00:00:00`, `${hasta} 23:59:59`] }
        }
      });
      return sum || 0;
    }));
    // Previstos: suma de líneas de reserva activas
    const previstas = await Promise.all(meses.map(async (mes) => {
      const desde = `${year}-${mes}-01`;
      const hasta = `${year}-${mes}-31`;
      const lineas = await models.LineaReserva.findAll({
        where: {
          fecha: { [Op.between]: [`${desde}`, `${hasta}`] },
          activa: true
        }
      });
      return lineas.reduce((acc, l) => acc + (parseFloat(l.precio) * l.cantidad_habitaciones), 0);
    }));
    res.json({ labels, reales, previstas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reservas por estado SOLO de la fecha actual y KPIs de llegadas/salidas de hoy
exports.obtenerReservasPorEstado = async (req, res) => {
  try {
    const models = require("../models");
    const { Op } = require("sequelize");
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];    // Para el gráfico: mostrar reservas confirmadas (incluyendo check-in) y anuladas del día
    const labels = ["Confirmadas", "Anuladas"];

    // Reservas confirmadas del día (incluye estado "Confirmada" y "Check-in")
    const reservasConfirmadas = await models.Reserva.count({
      where: {
        fecha_entrada: hoyStr,
        estado: { [Op.in]: ["Confirmada", "Check-in"] }
      }
    });

    // Reservas anuladas del día
    const reservasAnuladas = await models.Reserva.count({
      where: {
        fecha_entrada: hoyStr,
        estado: "Anulada"
      }
    });

    const data = [reservasConfirmadas, reservasAnuladas];// Llegadas previstas hoy: reservas con fecha_entrada = hoy y estado Confirmada o Check-in
    const llegadasPrevistas = await models.Reserva.count({
      where: {
        fecha_entrada: hoyStr,
        estado: { [Op.in]: ["Confirmada", "Check-in"] }
      }
    });
    // Llegadas realizadas hoy: reservas con fecha_entrada = hoy y estado Check-in
    const llegadasRealizadas = await models.Reserva.count({
      where: {
        fecha_entrada: hoyStr,
        estado: "Check-in"
      }
    });
    // Salidas previstas hoy: reservas con fecha_salida = hoy y estado Check-in o Check-out
    const salidasPrevistas = await models.Reserva.count({
      where: {
        fecha_salida: hoyStr,
        estado: { [Op.in]: ["Check-in", "Check-out"] }
      }
    });    // Salidas realizadas hoy: reservas con fecha_salida = hoy y estado Check-out
    const salidasRealizadas = await models.Reserva.count({
      where: {
        fecha_salida: hoyStr,
        estado: "Check-out"
      }
    });
    // Llegadas pendientes: previstas - realizadas
    const llegadasPendientes = llegadasPrevistas - llegadasRealizadas;
    // Salidas pendientes: previstas - realizadas
    const salidasPendientes = salidasPrevistas - salidasRealizadas;

    res.json({
      labels,
      data,
      llegadasPrevistas,
      llegadasRealizadas,
      llegadasPendientes,
      salidasPrevistas,
      salidasRealizadas,
      salidasPendientes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener datos para el calendario de ocupación
exports.obtenerDatosCalendarioOcupacion = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    if (!desde || !hasta) {
      return res.status(400).json({ error: "Debes especificar fecha 'desde' y 'hasta'" });
    }

    const datos = await GestorInformes.obtenerDatosCalendarioOcupacion(desde, hasta);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


