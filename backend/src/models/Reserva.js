const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reserva = sequelize.define("Reserva", {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_huesped: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_entrada: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_salida: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  numero_habitacion: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM("Confirmada", "Anulada", "Check-in", "Check-out"),
    allowNull: false
  }
}, {
  tableName: "Reservas",
  timestamps: false,
  // Validar que la fecha de salida sea posterior a la de entrada
  validate: {
    fechasValidas() {
            if (this.fecha_salida <= this.fecha_entrada) {
        throw new Error("La fecha de salida debe ser posterior a la fecha de entrada");
      }
    }
  }
});

module.exports = Reserva;
