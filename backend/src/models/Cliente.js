const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define("Cliente", {
  id_cliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true // Clave primaria autoincremental
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo_documento: {
    type: DataTypes.ENUM("DNI", "Pasaporte", "Documento de Identidad", "Permiso de Residencia"),
    allowNull: false // Solo permite valores predefinidos
  },
  numero_documento: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true // Asegura que no haya documentos repetidos
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  codigo_postal: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true // Valida el formato del email si se proporciona
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "Clientes",
  timestamps: true // Agrega automáticamente las columnas createdAt y updatedAt
});

module.exports = Cliente;
