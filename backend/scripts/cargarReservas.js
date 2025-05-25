const fs = require("fs");
const path = require("path");
const sequelize = require("../src/config/database");
const Reserva = require("../src/models/Reserva");
const LineaReserva = require("../src/models/LineaReserva");

async function cargarReservas() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "reservas.json");
    const reservas = JSON.parse(fs.readFileSync(filePath, "utf8"));

    let insertadas = 0;

    for (const reserva of reservas) {
      const nuevaReserva = await Reserva.create(reserva);
      insertadas++;

      const fechaEntrada = new Date(reserva.fecha_entrada);
      const fechaSalida = new Date(reserva.fecha_salida);

      // Calcular número de noches (en milisegundos → días)
      const diferenciaMs = fechaSalida - fechaEntrada;
      const noches = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

      if (noches <= 0) continue;

      const precioPorNoche = reserva.precio_total / noches;

      for (let i = 0; i < noches; i++) {
        const fechaNoche = new Date(fechaEntrada);
        fechaNoche.setDate(fechaEntrada.getDate() + i);

        const fechaFormateada = fechaNoche.toISOString().split("T")[0];

        await LineaReserva.create({
          id_reserva: nuevaReserva.id_reserva,
          fecha: fechaFormateada,
          tipo_habitacion: "individual", // o el valor que desees por defecto
          cantidad_habitaciones: 1,
          cantidad_adultos: 2,
          cantidad_ninos: 0,
          regimen: "Solo Alojamiento",
          precio: precioPorNoche.toFixed(2),
          activa: true
        });
        
      }

      console.log(`Reserva de ${reserva.nombre_huesped} ${reserva.primer_apellido_huesped} insertada con ${noches} líneas.`);
    }

    console.log("\nCarga completada:");
    console.log(`Reservas insertadas: ${insertadas}`);
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada");
  }
}

cargarReservas();
