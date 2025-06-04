// Modelo Sequelize para la entidad Usuario.
// Define la estructura de la tabla 'Usuarios' y las restricciones de cada campo.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    // ID único y autoincremental para cada usuario
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Clave primaria de la tabla
      autoIncrement: true, // Se incrementa automáticamente
    },
    // Nombre completo del usuario (obligatorio)
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false // Obligatorio
    },
    // Nombre de usuario único para login (obligatorio)
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // El nombre de usuario debe ser único
    },
    // Email del usuario (obligatorio)
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Contraseña hasheada (obligatoria)
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false // Se almacena la contraseña hasheada
    },
    // Fecha de registro del usuario (por defecto, la fecha actual)
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Se establece automáticamente la fecha actual al registrarse
    },
    // ID del rol asociado al usuario (obligatorio, clave foránea)
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      references: {
        model: "Roles",
        key: "id_rol"
      } // Por defecto, los nuevos usuarios tendrán el rol 2
    },
    // Indica si el usuario está activo o desactivado
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

// Exporta el modelo para su uso en otros módulos
module.exports = Usuario;
