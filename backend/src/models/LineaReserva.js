// models/LineaReserva.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LineaReserva = sequelize.define("LineaReserva", {
  id_linea_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Reservas",
      key: "id_reserva"
    }
  },
  tipo_habitacion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cantidad_habitaciones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  regimen: {
    type: DataTypes.ENUM(
      "Solo Alojamiento",
      "Alojamiento y Desayuno",
      "Media Pensión",
      "Pensión Completa",
      "Todo Incluido"
    ),
    allowNull: false
  },
  cantidad_adultos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cantidad_ninos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "Lineas_Reserva",
  timestamps: false
});

module.exports = LineaReserva;
