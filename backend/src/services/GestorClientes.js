const Cliente = require("../models/Cliente");

// Operador de Sequelize para consultas avanzadas
const { Op } = require("sequelize");

class GestorClientes {
  // Crear un nuevo cliente
  async registrarCliente(datos) {
    return await Cliente.create(datos);
  }

  // Modificar un cliente
  async modificarCliente(id, nuevosDatos) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) throw new Error("Cliente no encontrado");
    await cliente.update(nuevosDatos);
    return cliente;
  }

  // 🔍 Buscar cliente por cuyo ID empìece por el filtro
  async buscarClientesPorId(filtro) {
    const clientes = await Cliente.findAll({
      where: { id_cliente: { [Op.startsWith]: filtro } },
    });

    if (clientes.length === 0)
      throw new Error("No se encontraron clientes con ese ID");

    return clientes;
  }

  // 🔍 Buscar clientes cuyo número de documento empiece por el filtro
  async buscarClientesPorNumeroDocumento(filtro) {
    const clientes = await Cliente.findAll({
      where: { numero_documento: { [Op.startsWith]: filtro } },
    });

    if (clientes.length === 0)
      throw new Error("No se encontraron clientes con ese número de documento");

    return clientes;
  }

  // 🔍 Buscar clientes cuyo apellido empiece por el filtro
  async buscarClientesPorApellido(filtro) {
    const clientes = await Cliente.findAll({
      where: { primer_apellido: { [Op.startsWith]: filtro } },
    });

    if (clientes.length === 0)
      throw new Error("No se encontraron clientes con ese apellido");

    return clientes;
  }
}

module.exports = new GestorClientes();
