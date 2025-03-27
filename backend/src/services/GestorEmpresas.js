const Empresa = require("../models/Empresa");

// Operador de Sequelize para consultas avanzadas
const { Op } = require("sequelize");

class GestorEmpresas {
  // Crear una nueva empresa
  async registrarEmpresa(datos) {
    const empresaExistente = await Empresa.findOne({ where: { cif: datos.cif } });
    if (empresaExistente) {
      throw new Error("Ya existe una empresa con ese CIF");
    }
      return await Empresa.create(datos);
  }
  

  // Modificar una empresa
  async modificarEmpresa(id, nuevosDatos) {
    const empresa = await Empresa.findByPk(id);
    if (!empresa) throw new Error("Empresa no encontrado");
    await empresa.update(nuevosDatos);
    return empresa;
  }

  // 🔍 Buscar empresa por cuyo ID empìece por el filtro
  async buscarEmpresasPorId(filtro) {
    const empresas = await Empresa.findAll({
      where: { id_empresa: { [Op.startsWith]: filtro } },
    });

    if (empresas.length === 0)
      throw new Error("No se encontraron empresas con ese ID");

    return empresas;
  }

  // 🔍 Buscar empresas cuyo CIF empiece por el filtro
  async buscarEmpresasPorCif(filtro) {
    const empresas = await Empresa.findAll({
      where: { cif: { [Op.startsWith]: filtro } },
    });

    if (empresas.length === 0)
      throw new Error("No se encontraron empresas con ese CIF");

    return empresas;
  }

  // 🔍 Buscar empresas cuyo nombre empiece por el filtro
  async buscarEmpresasPorNombre(filtro) {
    const empresas = await Empresa.findAll({
      where: { nombre: { [Op.startsWith]: filtro } },
    });

    if (empresas.length === 0)
      throw new Error("No se encontraron empresas con ese nombre");

    return empresas;
  }
}

module.exports = new GestorEmpresas();