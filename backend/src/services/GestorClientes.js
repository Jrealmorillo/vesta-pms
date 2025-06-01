// Servicio para la gestión de clientes.
// Incluye métodos para registrar, modificar y buscar clientes en la base de datos.

const Cliente = require("../models/Cliente");
const { Op } = require("sequelize"); // Operador de Sequelize para consultas avanzadas

class GestorClientes {
  // Crear un nuevo cliente, validando que no exista previamente por número de documento
  async registrarCliente(datos) {
    try {
      // Busca si ya existe un cliente con el mismo número de documento
      const clienteExistente = await Cliente.findOne({
        where: { numero_documento: datos.numero_documento },
      });
      // Si existe, lanza un error para evitar duplicados
      if (clienteExistente) {
        throw new Error("Ya existe un cliente con ese número de documento");
      }
      // Si no existe, crea el nuevo cliente
      return await Cliente.create(datos);
    } catch (error) {
      throw new Error("Error al registrar cliente: " + error.message);
    }
  }

  // Modificar un cliente existente por su ID
  async modificarCliente(id, nuevosDatos) {
    try {
      // Busca el cliente por su clave primaria
      const cliente = await Cliente.findByPk(id);
      // Si no existe, lanza un error
      if (!cliente) throw new Error("Cliente no encontrado");
      // Actualiza los datos del cliente
      await cliente.update(nuevosDatos);
      return cliente;
    } catch (error) {
      throw new Error("Error al modificar cliente: " + error.message);
    }
  }

  // Buscar clientes por ID (permite búsquedas parciales por el inicio del ID)
  async buscarClientesPorId(filtro) {
    try {
      // Busca todos los clientes cuyo id_cliente empieza por el filtro
      const clientes = await Cliente.findAll({
        where: { id_cliente: { [Op.startsWith]: filtro } },
      });
      // Si no se encuentra ninguno, lanza un error
      if (clientes.length === 0)
        throw new Error("No se encontraron clientes con ese ID");
      return clientes;
    } catch (error) {
      throw new Error("Error al buscar clientes por ID: " + error.message);
    }
  }

  // Buscar clientes por número de documento (permite búsquedas parciales)
  async buscarClientesPorNumeroDocumento(filtro) {
    try {
      // Busca todos los clientes cuyo número de documento empieza por el filtro
      const clientes = await Cliente.findAll({
        where: { numero_documento: { [Op.startsWith]: filtro } },
      });
      // Si no se encuentra ninguno, lanza un error
      if (clientes.length === 0)
        throw new Error(
          "No se encontraron clientes con ese número de documento"
        );
      return clientes;
    } catch (error) {
      throw new Error(
        "Error al buscar clientes por número de documento: " + error.message
      );
    }
  }
  // Buscar clientes por primer apellido (permite búsquedas parciales)
  async buscarClientesPorApellido(filtro) {
    try {
      // Busca todos los clientes cuyo primer apellido empieza por el filtro
      const clientes = await Cliente.findAll({
        where: { primer_apellido: { [Op.startsWith]: filtro } },
      });
      // Si no se encuentra ninguno, lanza un error
      if (clientes.length === 0)
        throw new Error("No se encontraron clientes con ese apellido");
      return clientes;
    } catch (error) {
      throw new Error(
        "Error al buscar clientes por apellido: " + error.message
      );
    }
  }

  // Buscar clientes por nombre (permite búsquedas parciales)
  async buscarClientesPorNombre(filtro) {
    try {
      // Busca todos los clientes cuyo nombre empieza por el filtro
      const clientes = await Cliente.findAll({
        where: { nombre: { [Op.startsWith]: filtro } },
      });
      // Si no se encuentra ninguno, lanza un error
      if (clientes.length === 0)
        throw new Error("No se encontraron clientes con ese nombre");
      return clientes;
    } catch (error) {
      throw new Error(
        "Error al buscar clientes por nombre: " + error.message
      );
    }
  }
}

// Exporta una instancia del servicio para su uso en los controladores
module.exports = new GestorClientes();
