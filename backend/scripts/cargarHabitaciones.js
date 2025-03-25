const fs = require("fs"); // Módulo para trabajar con archivos (lectura del JSON)
const path = require("path"); // Módulo para construir rutas de forma segura
const sequelize = require("../src/config/database"); // Conexión a la base de datos
const Habitacion = require("../src/models/Habitacion"); // Modelo Sequelize para la tabla Habitaciones

async function cargarHabitaciones() {
  try {
    await sequelize.authenticate(); // Verifica la conexión con la base de datos
    console.log("Conectado a la base de datos");

    // Construimos la ruta absoluta al archivo JSON de habitaciones
    const dataPath = path.join(__dirname, "habitaciones_hotel_pequeno.json");

    // Leemos y parseamos el archivo JSON
    const habitaciones = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    let insertadas = 0;
    let duplicadas = 0;

    // Recorremos cada habitación del archivo
    for (const habitacion of habitaciones) {
      // Comprobamos si ya existe una habitación con ese número
      const existente = await Habitacion.findByPk(habitacion.numero_habitacion);

      if (existente) {
        console.log(`Habitación ${habitacion.numero_habitacion} ya existe. Se omite.`);
        duplicadas++;
        continue;
      }

      // Si no existe, la insertamos en la base de datos
      await Habitacion.create(habitacion);
      console.log(`Habitación ${habitacion.numero_habitacion} creada.`);
      insertadas++;
    }

    // Resumen final de la operación
    console.log("Carga completada:");
    console.log(`Habitaciones insertadas: ${insertadas}`);
    console.log(`Habitaciones duplicadas (omitidas): ${duplicadas}`);
  } catch (error) {
    console.error("Error al cargar habitaciones:", error); // Manejo de errores global
  } finally {
    await sequelize.close(); // Cerramos la conexión aunque haya error
    console.log("Conexión cerrada");
  }
}

cargarHabitaciones(); // Ejecutamos la función principal
