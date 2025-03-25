const Habitacion = require("../models/Habitacion");

class GestorHabitaciones {
    // Crear una nueva habitación
    async registrarHabitacion(datos) {
        return await Habitacion.create(datos);
    }


    // Modificar los datos de una habitación
    async modificarHabitacion(numero_habitacion, nuevosDatos) {
        const habitacion = await Habitacion.findByPk(numero_habitacion);
        if (!habitacion) throw new Error("Habitación no encontrada");
        await habitacion.update(nuevosDatos);
        return habitacion;
    }

    // Eliminar una habitación
    async eliminarHabitacion(numero_habitacion) {
        const habitacion = await Habitacion.findByPk(numero_habitacion);
        if (!habitacion) throw new Error("Habitación no encontrada");
        await habitacion.destroy();
    }

    // Obtener todas las habitaciones
    async obtenerHabitaciones() {
        return await Habitacion.findAll();
    }

    // Obtener una habitación concreta
    async obtenerHabitacionPorNumero(numero_habitacion) {
        const habitacion = await Habitacion.findByPk(numero_habitacion);
        if (!habitacion) throw new Error("Habitación no encontrada");
        return habitacion;
    }
}

module.exports = new GestorHabitaciones();