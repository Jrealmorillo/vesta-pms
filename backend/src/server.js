require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleare
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Vesta PMS Backend funcionando correctamente");
});

const Usuario = require("./models/Usuario");

async function probarConexion() {
    try {
        const usuarios = await Usuario.findAll();
        console.log("Usuarios en la BBDD: ", usuarios.length);
    } catch (error) {
        console.error("Error al consultar usuarios: ", error);
    }
    
}

probarConexion();


const usuarioRoutes = require("./routes/usuarioRoutes");
// Rutas de la API
app.use("/usuarios", usuarioRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost: ${PORT}`);
});