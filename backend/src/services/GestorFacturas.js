// Servicio GestorFacturas.js
// Este servicio centraliza la lógica de negocio para la gestión de facturas en el sistema Vesta PMS.
// Permite crear, consultar, modificar, buscar y anular facturas, asegurando la integridad de los datos y la correcta asociación con reservas, clientes y detalles de factura.

const { Factura, DetalleFactura, Reserva, Cliente, Empresa } = require("../models");
const GestorDetalleFactura = require("./GestorDetalleFactura");
const { Op } = require("sequelize");

class GestorFacturas {
    // Crea una nueva factura a partir de una reserva y una lista de detalles.
    // Valida que los detalles no hayan sido facturados previamente y que el total sea mayor a cero.
    async crearFactura({ id_reserva, id_cliente, id_empresa = null, id_usuario, forma_pago, detalles }) {
        try {
            // Validar campos básicos obligatorios
            if (!forma_pago || !id_usuario || !detalles || detalles.length === 0) {
                throw new Error("Faltan datos necesarios para emitir la factura");
            }

            // Validación de exclusión mutua: una factura no puede tener tanto cliente como empresa
            if (id_cliente && id_empresa) {
                throw new Error("Una factura no puede estar asociada tanto a un cliente como a una empresa al mismo tiempo");
            }

            // Buscar detalles activos y no facturados
            const detallesAFacturar = await DetalleFactura.findAll({
                where: {
                    id_detalle: {
                        [Op.in]: detalles // Solo los detalles indicados
                    },
                    id_factura: null, // Solo detalles no facturados
                    activa: true // Solo detalles activos
                }
            });

            // Validar que todos los detalles existan y estén disponibles para facturación
            if (detallesAFacturar.length !== detalles.length) {
                throw new Error("Algunos cargos ya han sido facturados o no existen");
            }

            // Calcular el total de la factura sumando los totales de los detalles
            const total = detallesAFacturar
                .map((d) => parseFloat(d.total)) // Convertir a número
                .filter((n) => !isNaN(n)) // Filtrar valores no numéricos
                .reduce((suma, n) => suma + n, 0) // Sumar todos los totales
                .toFixed(2); // Redondear a dos decimales

            // Validación de total positivo
            if (total <= 0) {
                throw new Error("El total de la factura debe ser mayor que 0");
            }

            // Obtener la reserva asociada para extraer datos del huésped
            const reserva = await Reserva.findByPk(id_reserva);

            // Crear la factura con los datos recopilados
            const nuevaFactura = await Factura.create({
                id_reserva: reserva.id_reserva || null, // Puede ser null si no hay reserva
                id_cliente: reserva.id_cliente, // Cliente asociado a la reserva
                nombre_huesped: reserva.nombre_huesped, // Nombre del huésped
                primer_apellido_huesped: reserva.primer_apellido_huesped, // Primer apellido
                segundo_apellido_huesped: reserva.segundo_apellido_huesped, // Segundo apellido
                id_empresa, // Empresa asociada (opcional)
                id_usuario, // Usuario que emite la factura
                forma_pago, // Forma de pago seleccionada
                total, // Total calculado
                estado: "Pagada" // Estado inicial de la factura
            });

            // Asignar los detalles a la factura recién creada
            for (const detalle of detallesAFacturar) {
                await detalle.update({ id_factura: nuevaFactura.id_factura }); // Relacionar detalle con la factura
            }

            return nuevaFactura;
        } catch (error) {
            throw new Error("Error al crear la factura: " + error.message);
        }
    }    // Obtiene una factura por su ID, incluyendo detalles y cliente asociado.
    async obtenerFacturaPorId(id_factura) {
        try {
            const factura = await Factura.findByPk(id_factura, {
                include: [
                    {
                        model: DetalleFactura,
                        as: "detalles",
                        required: false // Incluye detalles si existen
                    },
                    {
                        model: Cliente,
                        as: "cliente",
                        required: false // Incluye cliente si existe
                    },
                    {
                        model: Empresa,
                        as: "empresa", 
                        required: false // Incluye empresa si existe
                    },
                    {
                        model: Reserva,
                        as: "reserva",
                        required: false // Incluye reserva para obtener datos del huésped
                    }
                ]
            });

            if (!factura) throw new Error("Factura no encontrada"); // Validación de existencia

            return factura;
        } catch (error) {
            throw new Error("Error al obtener factura: " + error.message);
        }
    }    // Modifica los datos generales de una factura (no los cargos/detalles).
    async modificarFactura(id_factura, nuevosDatos) {
        try {
            const factura = await Factura.findByPk(id_factura); // Buscar factura por ID
            if (!factura) throw new Error("Factura no encontrada"); // Validación de existencia

            // Validación de exclusión mutua: una factura no puede tener tanto cliente como empresa
            if (nuevosDatos.id_cliente && nuevosDatos.id_empresa) {
                throw new Error("Una factura no puede estar asociada tanto a un cliente como a una empresa al mismo tiempo");
            }

            // Si se está asignando un cliente, limpiar la empresa
            if (nuevosDatos.id_cliente !== undefined && nuevosDatos.id_cliente !== null) {
                nuevosDatos.id_empresa = null;
            }

            // Si se está asignando una empresa, limpiar el cliente
            if (nuevosDatos.id_empresa !== undefined && nuevosDatos.id_empresa !== null) {
                nuevosDatos.id_cliente = null;
            }

            await factura.update(nuevosDatos); // Actualizar campos permitidos
            return factura;
        } catch (error) {
            throw new Error("Error al modificar factura: " + error.message);
        }
    }

    // Busca facturas según filtros flexibles (ID, reserva, fecha de emisión).
    async buscarFacturas(filtros) {
        try {
            const condiciones = {};

            if (filtros.id_factura) {
                condiciones.id_factura = filtros.id_factura;
            }

            if (filtros.id_reserva) {
                condiciones.id_reserva = filtros.id_reserva;
            }

            // Filtrado por fecha de emisión (rango de día completo)
            if (filtros.fecha_emision) {
                const fecha = filtros.fecha_emision;
                condiciones.fecha_emision = {
                    [Op.gte]: `${fecha} 00:00:00`,
                    [Op.lte]: `${fecha} 23:59:59`,
                };
            }

            const facturas = await Factura.findAll({
                where: condiciones,
                order: [["fecha_emision", "ASC"]],
                include: [
                    {
                        model: DetalleFactura,
                        as: "detalles",
                        required: false,
                    },
                    {
                        model: Cliente,
                        as: "cliente",
                        required: false,
                    }
                ],
            });

            return facturas;
        } catch (error) {
            throw new Error("Error al buscar facturas: " + error.message);
        }
    }

    // Recalcula el total de una factura sumando todos sus detalles activos
    async recalcularTotalFactura(id_factura) {
        try {
            const factura = await Factura.findByPk(id_factura);
            if (!factura) throw new Error("Factura no encontrada");

            // Obtener todos los detalles activos de la factura
            const detalles = await DetalleFactura.findAll({
                where: {
                    id_factura,
                    activa: true
                }
            });

            // Calcular el nuevo total
            const nuevoTotal = detalles
                .reduce((suma, detalle) => suma + parseFloat(detalle.total || 0), 0)
                .toFixed(2);

            // Actualizar el total de la factura
            await factura.update({ total: nuevoTotal });

            return { 
                mensaje: "Total de factura recalculado correctamente",
                total_anterior: factura.total,
                total_nuevo: nuevoTotal,
                factura 
            };
        } catch (error) {
            throw new Error("Error al recalcular total de factura: " + error.message);
        }
    }

    // Anula una factura y todos sus detalles asociados, marcando la factura como anulada.
    async anularFactura(id_factura) {
        try {
            const factura = await Factura.findByPk(id_factura);
            if (!factura) throw new Error("Factura no encontrada");

            // Obtener los detalles activos asociados a la factura
            const detalles = await DetalleFactura.findAll({
                where: {
                    id_factura,
                    activa: true
                }
            });

            // Anular cada detalle asociado usando el gestor correspondiente
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

// Exporta una instancia única del gestor para su uso en controladores y rutas
module.exports = new GestorFacturas();
