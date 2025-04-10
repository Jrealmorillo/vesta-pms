require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Cargar modelos y asociaciones
require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Ruta de prueba para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("Vesta PMS Backend funcionando correctamente");
});

const usuarioRoutes = require("./routes/usuarioRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const habitacionRoutes = require("./routes/habitacionRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const facturaRoutes = require("./routes/facturaRoutes");
const detalleFacturaRoutes = require("./routes/detalleFacturaRoutes");


// Definir rutas de la API
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/empresas", empresaRoutes);
app.use("/habitaciones", habitacionRoutes);
app.use("/reservas", reservaRoutes);
app.use("/facturas", facturaRoutes);
app.use("/detalles-factura", detalleFacturaRoutes);



// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
