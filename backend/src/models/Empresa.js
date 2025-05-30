// Modelo Sequelize para la entidad Empresa.
// Define la estructura de la tabla 'Empresas' y las restricciones de cada campo.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Empresa = sequelize.define(
  "Empresa",
  {
    // ID único y autoincremental para cada empresa
    id_empresa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Nombre de la empresa (obligatorio)
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // CIF de la empresa (obligatorio y único)
    cif: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    // Dirección de la empresa (opcional)
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Ciudad donde se ubica la empresa (opcional)
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // País de la empresa (obligatorio)
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Código postal (opcional)
    codigo_postal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Teléfono de contacto (opcional)
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    // Email de contacto (opcional, validado si se proporciona)
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Indica si la empresa tiene crédito (por defecto, no)
    credito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Observaciones adicionales (opcional)
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Empresas",
    timestamps: false, // no incluye createdAt y updatedAt
  }
);

// Exporta el modelo para su uso en otros módulos
module.exports = Empresa;
