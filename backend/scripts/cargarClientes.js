const fs = require("fs"); // Módulo para manejar archivos
const path = require("path"); // Módulo para rutas
const sequelize = require("../src/config/database"); // Conexión a la base de datos
const Cliente = require("../src/models/Cliente"); // Modelo Sequelize de Cliente

async function cargarClientes() {
  try {
    await sequelize.authenticate(); // Verificamos que la conexión esté activa
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "clientes.json"); // Ruta al archivo
    const clientes = JSON.parse(fs.readFileSync(filePath, "utf8")); // Leemos y parseamos el JSON

    let insertados = 0;
    let duplicados = 0;

    for (const cliente of clientes) {
      // Verificamos si ya existe un cliente con ese número de documento
      const existente = await Cliente.findOne({
        where: { numero_documento: cliente.numero_documento }
      });

      if (existente) {
        console.log(`Cliente con documento "${cliente.numero_documento}" ya existe. Se omite.`);
        duplicados++;
        continue;
      }

      await Cliente.create(cliente); // Insertamos el cliente si no está duplicado
      console.log(`Cliente "${cliente.nombre} ${cliente.primer_apellido}" insertado.`);
      insertados++;
    }

    // Resumen final
    console.log("\nCarga completada:");
    console.log(`Clientes insertados: ${insertados}`);
    console.log(`Clientes duplicados (omitidos): ${duplicados}`);
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  } finally {
    await sequelize.close(); // Cerramos la conexión
    console.log("Conexión cerrada");
  }
}

cargarClientes();
