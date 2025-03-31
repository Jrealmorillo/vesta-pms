const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HistorialReserva = sequelize.define("HistorialReserva", {
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accion: {
    type: DataTypes.ENUM("Creación", "Anulación", "Recuperación", "Modificación"),
    allowNull: false,
  },
  fecha_accion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "Historial_Reserva",
  timestamps: false,
});

module.exports = HistorialReserva;
