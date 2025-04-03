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

// Usuario pertenece a un Rol
Usuario.belongsTo(Rol, {
  foreignKey: "id_rol",
  as: "rol",
});

// Rol tiene muchos usuarios
Rol.hasMany(Usuario, {
  foreignKey: "id_rol",
  as: "usuarios",
});

// Reserva pertenece a un Cliente
Reserva.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// Reserva pertenece a una Empresa
Reserva.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});

// Reserva tiene muchas líneas de reserva
Reserva.hasMany(LineaReserva, {
  foreignKey: "id_reserva",
  as: "lineas",
});

// Línea de reserva pertenece a una reserva
LineaReserva.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// HistorialReserva pertenece a una reserva
HistorialReserva.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});


// Factura pertenece a un cliente
Factura.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// Factura pertenece a una empresa
Factura.belongsTo(Empresa, {
  foreignKey: "id_empresa",
  as: "empresa",
});

// Factura pertenece a una reserva
Factura.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// Factura pertenece a un usuario (quien la emite)
Factura.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// DetalleFactura pertenece a una factura
DetalleFactura.belongsTo(Factura, {
  foreignKey: "id_factura",
  as: "factura",
});

// DetalleFactura pertenece a una reserva
DetalleFactura.belongsTo(Reserva, {
  foreignKey: "id_reserva",
  as: "reserva",
});

// DetalleFactura pertenece a un cliente
DetalleFactura.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// DetalleFactura pertenece a una habitación
DetalleFactura.belongsTo(Habitacion, {
  foreignKey: "id_habitacion",
  as: "habitacion",
});

// EXPORTACIÓN DE MODELOS
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
