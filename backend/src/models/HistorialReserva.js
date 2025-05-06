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
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accion: {
    type: DataTypes.ENUM("Confirmada", "Anulada", "Modificada", "Check-in", "Check-out"),
    allowNull: false
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
