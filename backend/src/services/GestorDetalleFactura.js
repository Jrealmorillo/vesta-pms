// Servicio para la gestión de detalles de factura.
// Incluye métodos para registrar, modificar, anular y consultar detalles de factura en la base de datos.

const DetalleFactura = require("../models/DetalleFactura");

class GestorDetalleFactura {
    // Añadir una nueva línea de factura
    async registrarDetalleFactura(datos) {
        try {
            // Crea un nuevo detalle de factura y lo marca como activo
            const nuevoDetalle = await DetalleFactura.create({
                ...datos,
                activa: true, 
            });
            return nuevoDetalle;
        } catch (error) {
            throw new Error(
                "Error al registrar detalle de factura: " + error.message
            );
        }
    }

    // Modificar una línea de factura existente
    async modificarDetalleFactura(id_detalle, nuevosDatos) {
        try {
            // Busca el detalle por su clave primaria
            const detalle = await DetalleFactura.findByPk(id_detalle);
            if (!detalle) throw new Error("Detalle de factura no encontrado");
            // Actualiza los datos del detalle
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
            // Busca el detalle por su clave primaria
            const detalle = await DetalleFactura.findByPk(id_detalle);
            if (!detalle) throw new Error("Detalle de factura no encontrado");
            // Calcula los importes negativos para reflejar la anulación
            const precioUnitarioNegativo = -Math.abs(detalle.precio_unitario);
            const totalNegativo = -Math.abs(detalle.total);
            // Actualiza el detalle: lo marca como inactivo, pone importes negativos y añade marca de anulado
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

    // Obtener detalles activos de una reserva (no facturados)
    async obtenerDetallesPendientesPorReserva(id_reserva) {
        try {
            // Busca todos los detalles activos de una reserva que aún no han sido asignados a factura
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

// Exporta una instancia del servicio para su uso en los controladores
module.exports = new GestorDetalleFactura();
