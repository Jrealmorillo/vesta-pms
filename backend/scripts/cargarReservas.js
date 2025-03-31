// Módulo para leer archivos
const fs = require("fs"); 
// Módulo para rutas seguras
const path = require("path"); 
// Conexión a la base de datos
const sequelize = require("../src/config/database");
// Modelos Sequelize de Reserva y LineaReserva
const Reserva = require("../src/models/Reserva"); 
const LineaReserva = require("../src/models/LineaReserva")

async function cargarReservas() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "reservas.json");
    const reservas = JSON.parse(fs.readFileSync(filePath, "utf8"));

    let insertadas = 0;
    let duplicadas = 0;

    for (const reserva of reservas) {
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
