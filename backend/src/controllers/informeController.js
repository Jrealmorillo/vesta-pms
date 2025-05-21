
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

