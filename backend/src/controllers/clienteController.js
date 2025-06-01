// Controlador para gestionar las operaciones relacionadas con clientes.
// Utiliza el servicio GestorClientes para la lógica de negocio y responde a las peticiones HTTP.

const GestorClientes = require("../services/GestorClientes");

exports.registrarCliente = async (req, res) => {
  try {
    // Registra un nuevo cliente con los datos recibidos en el cuerpo de la petición
    const cliente = await GestorClientes.registrarCliente(req.body);
    // Devuelve el cliente creado y un mensaje de éxito
    res.status(201).json({ mensaje: "Cliente registrado exitosamente", cliente });
  } catch (error) {
    // Devuelve un error detallado si la operación falla
    res.status(400).json({ error: "Error al registrar cliente: " + error.message });
  }
};

exports.modificarCliente = async (req, res) => {
  try {
    // Modifica un cliente existente identificado por su ID
    const cliente = await GestorClientes.modificarCliente(
      req.params.id,
      req.body
    );
    // Devuelve el cliente modificado y un mensaje de éxito
    res.json({ mensaje: "Cliente actualizado correctamente", cliente });
  } catch (error) {
    // Devuelve un error si el cliente no se encuentra
    res.status(404).json({ error: error.message });
  }
};

exports.buscarClientesPorId = async (req, res) => {
  try {
    // Busca clientes por ID usando el filtro recibido por parámetro
    const clientes = await GestorClientes.buscarClientesPorId(req.params.filtro);
    res.json(clientes);
  } catch (error) {
    // Devuelve un error si no se encuentran clientes
    res.status(404).json({ error: error.message });
  }
};

exports.buscarClientesPorNumeroDocumento = async (req, res) => {
  try {
    // Busca clientes por número de documento usando el filtro recibido por parámetro
    const clientes = await GestorClientes.buscarClientesPorNumeroDocumento(
      req.params.filtro
    );
    res.json(clientes);
  } catch (error) {
    // Devuelve un error si no se encuentran clientes
    res.status(404).json({ error: error.message });
  }
};

exports.buscarClientesPorApellido = async (req, res) => {
  try {
    // Busca clientes por apellido usando el filtro recibido por parámetro
    const clientes = await GestorClientes.buscarClientesPorApellido(
      req.params.filtro
    );
    res.json(clientes);
  } catch (error) {
    // Devuelve un error si no se encuentran clientes
    res.status(404).json({ error: error.message });
  }
};

exports.buscarClientesPorNombre = async (req, res) => {
  try {
    // Busca clientes por nombre usando el filtro recibido por parámetro
    const clientes = await GestorClientes.buscarClientesPorNombre(
      req.params.filtro
    );
    res.json(clientes);
  } catch (error) {
    // Devuelve un error si no se encuentran clientes
    res.status(404).json({ error: error.message });
  }
};
