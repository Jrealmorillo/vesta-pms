const fs = require("fs"); // Módulo para leer archivos
const path = require("path"); // Módulo para rutas seguras
const sequelize = require("../src/config/database"); // Conexión a la base de datos
const Empresa = require("../src/models/Empresa"); // Modelo Sequelize de Empresa

async function cargarEmpresas() {
  try {
    await sequelize.authenticate(); // Comprobamos conexión
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "empresas.json");
    const empresas = JSON.parse(fs.readFileSync(filePath, "utf8"));

    let insertadas = 0;
    let duplicadas = 0;

    for (const empresa of empresas) {
      // Verificamos si la empresa ya existe por su CIF
      const existente = await Empresa.findOne({
        where: { cif: empresa.cif }
      });

      if (existente) {
        console.log(`Empresa con CIF "${empresa.cif}" ya existe. Se omite.`);
        duplicadas++;
        continue;
      }

      await Empresa.create(empresa); // Insertamos la empresa si no está duplicada
      console.log(`Empresa "${empresa.nombre}" insertada.`);
      insertadas++;
    }

    // Mostramos resumen
    console.log("\nCarga completada:");
    console.log(`Empresas insertadas: ${insertadas}`);
    console.log(`Empresas duplicadas (omitidas): ${duplicadas}`);
  } catch (error) {
    console.error("Error al cargar empresas:", error);
  } finally {
    await sequelize.close(); // Cerramos conexión
    console.log("Conexión cerrada");
  }
}

cargarEmpresas();
