// Configuración y conexión a la base de datos MySQL usando Sequelize.
// Este archivo exporta la instancia de Sequelize para ser utilizada en los modelos y otros módulos.

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Conectar a MySQL usando las variables de .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // evita que Sequielize muestre todas las consultas por consola
  });

// Verificar conexión y mostrar mensaje en consola según el resultado
sequelize.authenticate()
  .then(() => console.log("Conectado a la BBDD MySQL"))
  .catch(err => console.error("Error de conexión: ", err));

module.exports = sequelize;
