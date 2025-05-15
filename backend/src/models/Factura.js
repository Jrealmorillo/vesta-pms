const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Factura = sequelize.define("Factura", {
  id_factura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_huésped: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  forma_pago: {
    type: DataTypes.ENUM("Efectivo", "Transferencia", "Visa", "Amex", "Crédito"),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("Pendiente", "Pagada", "Anulada"),
    allowNull: false,
  },
}, {
  tableName: "Facturas",
  timestamps: false,
});

module.exports = Factura;
