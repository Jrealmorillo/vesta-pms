// Modelo Sequelize para la entidad LineaReserva.
// Define la estructura de la tabla 'Lineas_Reserva' y las restricciones de cada campo.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LineaReserva = sequelize.define("LineaReserva", {
  // ID único y autoincremental para cada línea de reserva
  id_linea_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // ID de la reserva asociada (obligatorio, clave foránea)
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Reservas",
      key: "id_reserva"
    }
  },
  // Tipo de habitación reservada (solo valores permitidos)
  tipo_habitacion: {
    type: DataTypes.ENUM("Individual", "Doble", "Triple", "Suite"),
    allowNull: false
  },
  // Número de habitaciones reservadas (mínimo 1)
  cantidad_habitaciones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  // Fecha de la reserva (obligatoria)
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  // Precio por habitación (obligatorio)
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Régimen de la reserva (solo valores permitidos)
  regimen: {
    type: DataTypes.ENUM(
      "Solo Alojamiento",
      "Alojamiento y Desayuno",
      "Media Pensión",
      "Pensión Completa"
    ),
    allowNull: false
  },
  // Número de adultos en la línea de reserva
  cantidad_adultos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // Número de niños en la línea de reserva
  cantidad_ninos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // Indica si la línea está activa o ha sido anulada
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "Lineas_Reserva",
  timestamps: false
});

// Exporta el modelo para su uso en otros módulos
module.exports = LineaReserva;
