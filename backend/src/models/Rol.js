const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rol = sequelize.define("Rol", {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "Roles",
  timestamps: false,
});

module.exports = Rol;
