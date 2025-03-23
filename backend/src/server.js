require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const sequelize = require("./config/database");

sequelize.sync({ alter: true })
  .then(() => console.log("Base de datos actualizada correctamente"))
  .catch((error) => console.error("Error al sincronizar BBDD:", error));

// Ruta de prueba para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("Vesta PMS Backend funcionando correctamente");
});

const usuarioRoutes = require("./routes/usuarioRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const empresaRoutes = require("./routes/empresaRoutes");

// Definir rutas de la API
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/empresas", empresaRoutes);

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
