// Modelo Sequelize para la entidad Reserva.
// Define la estructura de la tabla 'Reservas' y las restricciones de cada campo.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reserva = sequelize.define("Reserva", {
  // ID único y autoincremental para cada reserva
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Nombre del huésped principal (obligatorio)
  nombre_huesped: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  // Primer apellido del huésped (obligatorio)
  primer_apellido_huesped: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Segundo apellido del huésped (opcional)
  segundo_apellido_huesped: {
    type: DataTypes.STRING(100),
    allowNull: true // Se permiten NULL para casos de clientes con 1 solo apellido
  },
  // ID del cliente asociado (opcional)
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // ID de la empresa asociada (opcional)
  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Fecha de entrada de la reserva (obligatoria)
  fecha_entrada: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  // Fecha de salida de la reserva (obligatoria)
  fecha_salida: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  // Número de habitación asignado (opcional)
  numero_habitacion: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Precio total de la reserva (obligatorio, por defecto 0)
  precio_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  // Observaciones adicionales (opcional)
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Estado de la reserva (obligatorio, solo valores permitidos)
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

// Exporta el modelo para su uso en otros módulos
module.exports = Reserva;
