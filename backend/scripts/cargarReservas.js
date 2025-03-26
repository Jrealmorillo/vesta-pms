const fs = require("fs"); // Módulo para leer archivos
const path = require("path"); // Módulo para rutas seguras
const sequelize = require("../src/config/database"); // Conexión a la base de datos
const Reserva = require("../src/models/Reserva"); // Modelo Sequelize de Reserva

async function cargarReservas() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "reservas.json");
    const reservas = JSON.parse(fs.readFileSync(filePath, "utf8"));

    let insertadas = 0;
    let duplicadas = 0;

    for (const reserva of reservas) {
      // Comprobamos si ya existe una reserva igual en la misma fecha y habitación
      const existe = await Reserva.findOne({
        where: {
          nombre_huesped: reserva.nombre_huesped,
          fecha_entrada: reserva.fecha_entrada,
          fecha_salida: reserva.fecha_salida,
          numero_habitacion: reserva.numero_habitacion
        }
      });

      if (existe) {
        console.log(`Reserva duplicada de ${reserva.nombre_huesped} en habitación ${reserva.numero_habitacion}. Se omite.`);
        duplicadas++;
        continue;
      }

      await Reserva.create(reserva);
      console.log(`Reserva de ${reserva.nombre_huesped} insertada.`);
      insertadas++;
    }

    console.log("\nCarga completada:");
    console.log(`Reservas insertadas: ${insertadas}`);
    console.log(`Reservas duplicadas (omitidas): ${duplicadas}`);
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada");
  }
}

cargarReservas();
