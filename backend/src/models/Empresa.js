// models/Empresa.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Empresa = sequelize.define(
  "Empresa",
  {
    id_empresa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cif: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    credito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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

module.exports = Empresa;
