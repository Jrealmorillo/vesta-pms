
// Modelo Sequelize para la entidad Cliente.
// Define la estructura de la tabla 'Clientes' y las restricciones de cada campo.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define("Cliente", {
  // ID único y autoincremental para cada cliente
  id_cliente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true // Clave primaria autoincremental
  },
  // Nombre del cliente (obligatorio)
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  // Primer apellido (obligatorio)
  primer_apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Segundo apellido (opcional)
  segundo_apellido: {
    type: DataTypes.STRING(100),
    allowNull: true // Se permiten NULL para casos de clientes con 1 solo apellido
  },
  // Fecha de nacimiento (obligatoria)
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Género del cliente (solo valores permitidos)
  genero: {
    type: DataTypes.ENUM("Masculino", "Femenino"),
    allowNull: false
  },
  // Tipo de documento identificativo
  tipo_documento: {
    type: DataTypes.ENUM("DNI", "Pasaporte", "Documento de Identidad", "Permiso de Residencia"),
    allowNull: false // Solo permite valores predefinidos
  },
  // Número de documento (único y obligatorio)
  numero_documento: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true // Asegura que no haya documentos repetidos
  },
  // Fecha de expedición del documento
  fecha_expedicion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Dirección completa (opcional)
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Ciudad de residencia (opcional)
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // País de residencia (obligatorio)
  pais: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Código postal (opcional)
  codigo_postal: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Teléfono de contacto (opcional)
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  // Email de contacto (opcional, validado si se proporciona)
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Observaciones adicionales (opcional)
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "Clientes",
  timestamps: false // no incluye createdAt y updatedAt
});

// Exporta el modelo para su uso en otros módulos
module.exports = Cliente;
