// Archivo de entrada para la definición y relación de todos los modelos Sequelize del sistema.
// Aquí se importan los modelos y se definen las relaciones entre ellos para reflejar la estructura de la base de datos.

const Usuario = require("./Usuario");
const Rol = require("./Rol");
const Cliente = require("./Cliente");
const Empresa = require("./Empresa");
const Habitacion = require("./Habitacion");
const Reserva = require("./Reserva");
const LineaReserva = require("./LineaReserva");
const HistorialReserva = require("./HistorialReserva");
const Factura = require("./Factura");
const DetalleFactura = require("./DetalleFactura");

// RELACIONES ENTRE MODELOS

// Usuario pertenece a un Rol (relación muchos a uno)
Usuario.belongsTo(Rol, {
  foreignKey: "id_rol",
  as: "rol",
});

// Rol tiene muchos usuarios (relación uno a muchos)
Rol.hasMany(Usuario, {
  foreignKey: "id_rol",
  as: "usuarios",
});

// Reserva pertenece a un Cliente (relación muchos a uno)
Reserva.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// Reserva pertenece a una Empresa (relación muchos a uno)
Reserva.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});

// Reserva tiene muchas líneas de reserva (relación uno a muchos)
Reserva.hasMany(LineaReserva, {
  foreignKey: "id_reserva",
  as: "lineas",
});

// Una misma reserva puede tener varias facturas asociadas (relación uno a muchos)
Reserva.hasMany(Factura, {
  foreignKey: "id_reserva",
  as: "facturas",
});

// Línea de reserva pertenece a una reserva (relación muchos a uno)
LineaReserva.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// HistorialReserva pertenece a una reserva (relación muchos a uno)
HistorialReserva.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// Factura pertenece a un cliente (relación muchos a uno)
Factura.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// Factura pertenece a una empresa (relación muchos a uno)
Factura.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});

// Factura pertenece a una reserva (relación muchos a uno)
Factura.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// Factura pertenece a un usuario (quien la emite) (relación muchos a uno)
Factura.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Factura tiene muchos detalles de factura (relación uno a muchos)
Factura.hasMany(DetalleFactura, {
  foreignKey: "id_factura",
  as: "detalles"
});

// DetalleFactura pertenece a una factura (relación muchos a uno)
DetalleFactura.belongsTo(Factura, {
  foreignKey: "id_factura",
  as: "factura",
});

// DetalleFactura pertenece a una reserva (relación muchos a uno)
DetalleFactura.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// DetalleFactura pertenece a un cliente (relación muchos a uno)
DetalleFactura.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// DetalleFactura pertenece a una habitación (relación muchos a uno)
DetalleFactura.belongsTo(Habitacion, {
  foreignKey: "id_habitacion",
  as: "habitacion",
});

// Exportación de todos los modelos para su uso en el resto de la aplicación
module.exports = {
  Usuario,
  Rol,
  Cliente,
  Empresa,
  Habitacion,
  Reserva,
  LineaReserva,
  HistorialReserva,
  Factura,
  DetalleFactura,
};
