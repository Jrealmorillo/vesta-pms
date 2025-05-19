// Modelo Sequelize para la entidad Rol.
// Define la estructura de la tabla 'Roles' y las restricciones de cada campo.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rol = sequelize.define("Rol", {
  // ID único y autoincremental para cada rol
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Nombre del rol (obligatorio y único)
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "Roles",
  timestamps: false,
});

// Exporta el modelo para su uso en otros módulos
module.exports = Rol;
