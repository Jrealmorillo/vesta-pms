const fs = require("fs"); // Para leer el archivo JSON
const path = require("path"); // Para construir la ruta al archivo
const bcrypt = require("bcryptjs"); // Para hashear contraseñas
const sequelize = require("../src/config/database"); // Conexión a la BBDD
const Usuario = require("../src/models/Usuario"); // Modelo de Usuario

async function cargarUsuarios() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    const filePath = path.join(__dirname, "usuarios.json");

    const usuarios = JSON.parse(fs.readFileSync(filePath, "utf8"));

    let insertados = 0;
    let duplicados = 0;

    for (const usuario of usuarios) {
      // Verificamos si ya existe el usuario por su nombre_usuario o email
      const existente = await Usuario.findOne({
        where: {
          nombre_usuario: usuario.nombre_usuario,
        },
      });

      if (existente) {
        console.log(`Usuario "${usuario.nombre_usuario}" ya existe. Se omite.`);
        duplicados++;
        continue;
      }

      // Hasheamos la contraseña antes de guardarla
      const hash = await bcrypt.hash(usuario.contraseña, 10);

      // Creamos el usuario con la contraseña cifrada
      await Usuario.create({
        ...usuario,
        contraseña: hash,
      });

      console.log(`Usuario "${usuario.nombre_usuario}" insertado.`);
      insertados++;
    }

    console.log("Carga completada:");
    console.log(`Usuarios insertados: ${insertados}`);
    console.log(`Usuarios duplicados (omitidos): ${duplicados}`);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada");
  }
}

cargarUsuarios();
