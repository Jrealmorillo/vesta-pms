//
// Modelo Sequelize para la entidad Factura.
// Define la estructura de la tabla 'Facturas' y las restricciones de cada campo.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Factura = sequelize.define("Factura", {
  // ID único y autoincremental para cada factura
  id_factura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Nombre del huésped asociado a la factura (opcional)
  nombre_huésped: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  // ID del cliente asociado (opcional)
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // ID de la empresa asociada (opcional)
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // ID de la reserva asociada (obligatorio)
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // ID del usuario que emitió la factura (obligatorio)
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Fecha de emisión de la factura (por defecto, hoy)
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Importe total de la factura
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  // Forma de pago utilizada (obligatoria, solo valores permitidos)
  forma_pago: {
    type: DataTypes.ENUM("Efectivo", "Transferencia", "Visa", "Amex", "Crédito"),
    allowNull: false,
  },
  // Estado de la factura (obligatorio, solo valores permitidos)
  estado: {
    type: DataTypes.ENUM("Pendiente", "Pagada", "Anulada"),
    allowNull: false,
  },
}, {
  tableName: "Facturas",
  timestamps: false,
});

// Exporta el modelo para su uso en otros módulos
module.exports = Factura;
