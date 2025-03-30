const Cliente = require("../models/Cliente");

// Operador de Sequelize para consultas avanzadas
const { Op } = require("sequelize");

class GestorClientes {
  // Crear un nuevo cliente
  async registrarCliente(datos) {
    try {
      const clienteExistente = await Cliente.findOne({
        where: { numero_documento: datos.numero_documento },
      });

      if (clienteExistente) {
        throw new Error("Ya existe un cliente con ese número de documento");
      }

      return await Cliente.create(datos);
    } catch (error) {
      throw new Error("Error al registrar cliente: " + error.message);
    }
  }

  // Modificar un cliente
  async modificarCliente(id, nuevosDatos) {
    try {
      const cliente = await Cliente.findByPk(id);
      if (!cliente) throw new Error("Cliente no encontrado");
      await cliente.update(nuevosDatos);
      return cliente;
    } catch (error) {
      throw new Error("Error al modificar cliente: " + error.message);
    }
  }

  // Buscar clientes por ID
  async buscarClientesPorId(filtro) {
    try {
      const clientes = await Cliente.findAll({
        where: { id_cliente: { [Op.startsWith]: filtro } },
      });

      if (clientes.length === 0)
        throw new Error("No se encontraron clientes con ese ID");

      return clientes;
    } catch (error) {
      throw new Error("Error al buscar clientes por ID: " + error.message);
    }
  }

  // Buscar clientes por número de documento
  async buscarClientesPorNumeroDocumento(filtro) {
    try {
      const clientes = await Cliente.findAll({
        where: { numero_documento: { [Op.startsWith]: filtro } },
      });

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

  // Buscar clientes por apellido
  async buscarClientesPorApellido(filtro) {
    try {
      const clientes = await Cliente.findAll({
        where: { primer_apellido: { [Op.startsWith]: filtro } },
      });

      if (clientes.length === 0)
        throw new Error("No se encontraron clientes con ese apellido");

      return clientes;
    } catch (error) {
      throw new Error(
        "Error al buscar clientes por apellido: " + error.message
      );
    }
  }
}

module.exports = new GestorClientes();
