const DetalleFactura = require("../models/DetalleFactura");
const GestorHistorialReservas = require("./GestorHistorialReservas"); // si deseas dejar registro

class GestorDetalleFactura {
    // Añadir una nueva línea de factura
    async registrarDetalleFactura(datos) {
        try {
            const nuevoDetalle = await DetalleFactura.create({
                ...datos,
                activa: true, // por defecto
            });

            return nuevoDetalle;
        } catch (error) {
            throw new Error(
                "Error al registrar detalle de factura: " + error.message
            );
        }
    }

    // Modificar una línea de factura
    async modificarDetalleFactura(id_detalle, nuevosDatos) {
        try {
            const detalle = await DetalleFactura.findByPk(id_detalle);
            if (!detalle) throw new Error("Detalle de factura no encontrado");

            await detalle.update(nuevosDatos);
            return detalle;
        } catch (error) {
            throw new Error(
                "Error al modificar detalle de factura: " + error.message
            );
        }
    }

    // Anular un cargo y reflejarlo como importe negativo
    async anularDetalleFactura(id_detalle) {
        try {
            const detalle = await DetalleFactura.findByPk(id_detalle);
            if (!detalle) throw new Error("Detalle de factura no encontrado");

            const precioUnitarioNegativo = -Math.abs(detalle.precio_unitario);
            const totalNegativo = -Math.abs(detalle.total);

            await detalle.update({
                activa: false,
                precio_unitario: precioUnitarioNegativo,
                total: totalNegativo,
                descripcion: detalle.descripcion + " (ANULADO)",
            });

            return {
                mensaje:
                    "Detalle de factura anulado correctamente (como cargo negativo)",
            };
        } catch (error) {
            throw new Error("Error al anular detalle de factura: " + error.message);
        }
    }


    // Obtener detalles activos de una reserva
    async obtenerDetallesPendientesPorReserva(id_reserva) {
        try {
            return await DetalleFactura.findAll({
                where: {
                    id_reserva,
                    id_factura: null, // aún no asignados a factura
                    activa: true,
                },
            });
        } catch (error) {
            throw new Error(
                "Error al obtener cargos pendientes de la reserva: " + error.message
            );
        }
    }
}

module.exports = new GestorDetalleFactura();
