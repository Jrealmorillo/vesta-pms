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

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log("Conectado a la BBDD MySQL"))
  .catch(err => console.error("Error de conexión: ", err));

  module.exports = sequelize;
