// Servicio GestorEmpresas.js
// Este servicio centraliza la lógica de negocio relacionada con la gestión de empresas en el sistema.
// Permite registrar, modificar y buscar empresas por diferentes criterios (ID, CIF, nombre).
// Utiliza el modelo Empresa y operadores avanzados de Sequelize para consultas flexibles.

const Empresa = require("../models/Empresa");

// Operador de Sequelize para consultas avanzadas
const { Op } = require("sequelize");

class GestorEmpresas {
  // Crea una nueva empresa en la base de datos.
  // Valida que no exista otra empresa con el mismo CIF antes de crearla.
  async registrarEmpresa(datos) {
    try {
      // Busca si ya existe una empresa con el mismo CIF
      const empresaExistente = await Empresa.findOne({
        where: { cif: datos.cif },
      });
      if (empresaExistente) {
        // Evita duplicidad de CIF
        throw new Error("Ya existe una empresa con ese CIF");
      }
      // Crea la empresa si no existe duplicado
      return await Empresa.create(datos);
    } catch (error) {
      throw new Error("Error al registrar la empresa: " + error.message);
    }
  }

  // Modifica los datos de una empresa existente por su ID.
  async modificarEmpresa(id, nuevosDatos) {
    try {
      // Busca la empresa por su clave primaria (ID único)
      const empresa = await Empresa.findByPk(id);
      if (!empresa) throw new Error("Empresa no encontrado"); // Valida existencia antes de modificar
      // Actualiza los datos de la empresa con los nuevos valores recibidos
      await empresa.update(nuevosDatos);
      return empresa;
    } catch (error) {
      throw new Error("Error al modificar la empresa: " + error.message);
    }
  }

  // Busca empresas cuyo ID empiece por el filtro proporcionado.
  async buscarEmpresasPorId(filtro) {
    try {
      // Utiliza el operador startsWith para filtrar empresas cuyo id_empresa comienza con el filtro
      const empresas = await Empresa.findAll({
        where: { id_empresa: { [Op.startsWith]: filtro } },
      });

      if (empresas.length === 0)
        throw new Error("No se encontraron empresas con ese ID"); // Valida que haya resultados

      return empresas;
    } catch (error) {
      throw new Error("Error al encontrar la empresa: " + error.message);
    }
  }

  // Busca empresas cuyo CIF empiece por el filtro proporcionado.
  async buscarEmpresasPorCif(filtro) {
    try {
      const empresas = await Empresa.findAll({
        where: { cif: { [Op.startsWith]: filtro } },
      });

      if (empresas.length === 0)
        throw new Error("No se encontraron empresas con ese CIF");

      return empresas;
    } catch (error) {
      throw new Error("Error al encontrar la empresa: " + error.message);
    }
  }

  // Busca empresas cuyo nombre empiece por el filtro proporcionado.
  async buscarEmpresasPorNombre(filtro) {
    try {
      const empresas = await Empresa.findAll({
        where: { nombre: { [Op.startsWith]: filtro } },
      });

      if (empresas.length === 0)
        throw new Error("No se encontraron empresas con ese nombre");

      return empresas;
    } catch (error) {
      throw new Error("Error al encontrar la empresa: " + error.message);
    }
  }
}

// Exporta una instancia única del gestor para su uso en controladores y rutas
module.exports = new GestorEmpresas();
