const { Factura, DetalleFactura, Reserva } = require("../models");
const GestorDetalleFactura = require("./GestorDetalleFactura");
const { Op } = require("sequelize");


class GestorFacturas {
    // Crear una nueva factura
    async crearFactura({ id_reserva, id_cliente, id_empresa = null, id_usuario, forma_pago, detalles }) {
        try {
            // Validar campos básicos
            if (!id_reserva || !forma_pago || !id_usuario || !detalles || detalles.length === 0) {
                throw new Error("Faltan datos necesarios para emitir la factura");
            }

            // Verificar que los detalles existan y no estén ya facturados
            const detallesAFacturar = await DetalleFactura.findAll({
                where: {
                    id_detalle: {
                        [Op.in]: detalles
                    },
                    id_factura: null, // Solo facturables si no tienen factura aún
                    activa: true
                }
            });

            if (detallesAFacturar.length !== detalles.length) {
                throw new Error("Algunos cargos ya han sido facturados o no existen");
            }

            // Calcular el total
            const total = detallesAFacturar.reduce((suma, d) => suma + d.total, 0);

            if (total <= 0) {
                throw new Error("El total de la factura debe ser mayor que 0");
            }

            // Crear la factura
            const nuevaFactura = await Factura.create({
                id_reserva,
                id_cliente,
                id_empresa,
                id_usuario,
                forma_pago,
                total,
                estado: "Pendiente"
            });

            // Asignar los detalles a la factura
            for (const detalle of detallesAFacturar) {
                await detalle.update({ id_factura: nuevaFactura.id_factura });
            }

            return nuevaFactura;

        } catch (error) {
            throw new Error("Error al crear la factura: " + error.message);
        }
    }

    // Obtener una factura por su ID, incluyendo detalles
    async obtenerFacturaPorId(id_factura) {
        try {
            const factura = await Factura.findByPk(id_factura, {
                include: [
                    {
                        model: DetalleFactura,
                        as: "detalles",
                        required: false
                    }
                ]
            });

            if (!factura) throw new Error("Factura no encontrada");

            return factura;
        } catch (error) {
            throw new Error("Error al obtener factura: " + error.message);
        }
    }

    // Modificar datos generales de una factura (no los cargos)
    async modificarFactura(id_factura, nuevosDatos) {
        try {
            const factura = await Factura.findByPk(id_factura);
            if (!factura) throw new Error("Factura no encontrada");

            await factura.update(nuevosDatos);
            return factura;
        } catch (error) {
            throw new Error("Error al modificar factura: " + error.message);
        }
    }

    // Anular una factura (y sus detalles asociados)
    async anularFactura(id_factura) {
        try {
            const factura = await Factura.findByPk(id_factura);
            if (!factura) throw new Error("Factura no encontrada");

            // Obtener los detalles asociados
            const detalles = await DetalleFactura.findAll({
                where: {
                    id_factura,
                    activa: true
                }
            });

            // Anular cada línea
            for (const detalle of detalles) {
                await GestorDetalleFactura.anularDetalleFactura(detalle.id_detalle);
            }

            // Marcar la factura como anulada
            await factura.update({ estado: "Anulada" });

            return {
                mensaje: "Factura anulada correctamente, incluyendo sus cargos.",
                factura
            };
        } catch (error) {
            throw new Error("Error al anular factura: " + error.message);
        }
    }
}

module.exports = new GestorFacturas();
