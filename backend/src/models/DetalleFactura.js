const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetalleFactura = sequelize.define("DetalleFactura", {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_factura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_habitacion: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  concepto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: "Detalle_Factura",
  timestamps: false,
});

module.exports = DetalleFactura;
