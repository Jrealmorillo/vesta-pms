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


