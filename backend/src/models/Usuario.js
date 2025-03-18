const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    contraseña: { type: DataTypes.STRING(255), allowNull: false },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_rol: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "Usuarios",
    timestamps: false, // No queremos que Sequelize añada columnas `createdAt` y `updatedAt`
  }
);

module.exports = Usuario;
