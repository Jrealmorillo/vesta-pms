// Modelo Sequelize para la entidad DetalleFactura.
// Define la estructura de la tabla 'Detalle_Factura' y las restricciones de cada campo.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetalleFactura = sequelize.define("DetalleFactura", {
  // ID único y autoincremental para cada detalle de factura
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ID de la reserva asociada (obligatorio)
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // ID de la factura asociada (puede ser null si aún no está facturado)
  id_factura: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // ID de la habitación asociada (opcional, puede ser string por compatibilidad)
  id_habitacion: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // ID del cliente asociado (opcional)
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Descripción del concepto facturado (obligatorio)
  concepto: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Fecha del cargo (obligatoria, por defecto hoy)
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Cantidad de unidades facturadas (mínimo 1)
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  // Precio unitario del concepto
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  // Importe total del detalle
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  // Indica si el detalle está activo o ha sido anulado
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: "Detalle_Factura",
  timestamps: false,
});

// Exporta el modelo para su uso en otros módulos
module.exports = DetalleFactura;
