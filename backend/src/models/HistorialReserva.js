// Modelo Sequelize para la entidad HistorialReserva.
// Define la estructura de la tabla 'Historial_Reserva' y las restricciones de cada campo.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HistorialReserva = sequelize.define("HistorialReserva", {
  // ID único y autoincremental para cada registro de historial
  id_historial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ID de la reserva asociada (obligatorio)
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Nombre del usuario que realizó la acción (obligatorio)
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Acción realizada sobre la reserva (solo valores permitidos)
  accion: {
    type: DataTypes.ENUM("Confirmada", "Anulada", "Modificada", "Check-in", "Check-out"),
    allowNull: false
  },
  // Fecha y hora en que se realizó la acción (por defecto, ahora)
  fecha_accion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Detalles adicionales sobre la acción (opcional)
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "Historial_Reserva",
  timestamps: false,
});

// Exporta el modelo para su uso en otros módulos
module.exports = HistorialReserva;
