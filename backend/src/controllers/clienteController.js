const GestorClientes = require("../services/GestorClientes");

// Registrar un nuevo cliente
exports.registrarCliente = async (req, res) => {
  try {
    const cliente = await GestorClientes.registrarCliente(req.body);
    res
      .status(201)
      .json({ mensaje: "Cliente registrado exitosamente", cliente });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al registrar cliente", detalle: error.message });
  }
};

// Modificar un cliente
exports.modificarCliente = async (req, res) => {
  try {
    const cliente = await GestorClientes.modificarCliente(
      req.params.id,
      req.body
    );
    res.json({ mensaje: "Cliente actualizado correctamente", cliente });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Buscar clientes por ID
exports.buscarClientesPorId = async (req, res) => {
  try {
    const clientes = await GestorClientes.buscarClientesPorId(req.params.filtro);
    res.json(clientes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Buscar clientes por número de documento
exports.buscarClientesPorNumeroDocumento = async (req, res) => {
  try {
    const clientes = await GestorClientes.buscarClientesPorNumeroDocumento(
      req.params.filtro
    );
    res.json(clientes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Buscar clientes por apellido
exports.buscarClientesPorApellido = async (req, res) => {
  try {
    const clientes = await GestorClientes.buscarClientesPorApellido(
      req.params.filtro
    );
    res.json(clientes);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
