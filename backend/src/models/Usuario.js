const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definición del modelo Usuario basado en la tabla `Usuarios` en la base de datos
const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria de la tabla
      autoIncrement: true, // Se incrementa automáticamente
    },
    nombre: { 
      type: DataTypes.STRING(100), 
      allowNull: false // Obligatorio
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // El nombre de usuario debe ser único
    },
    email: { 
      type: DataTypes.STRING(255), 
      allowNull: false, 
      unique: true // El email también debe ser único
    },
    contraseña: { 
      type: DataTypes.STRING(255), 
      allowNull: false // Se almacena la contraseña hasheada
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Se establece automáticamente la fecha actual al registrarse
    },
    id_rol: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 2 // Por defecto, los nuevos usuarios tendrán el rol 1
    },
    activo: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true // Indica si el usuario está activo o desactivado
    },
  },
  {
    tableName: "Usuarios", // Nombre exacto de la tabla en la base de datos
    timestamps: false, // No agregamos `createdAt` ni `updatedAt`
  }
);

module.exports = Usuario;
