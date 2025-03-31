require("dotenv").config();

const { Usuario, Rol } = require("../src/models");

async function probarUsuarios() {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: Rol,
        as: "rol",
        attributes: ["id_rol", "nombre"]
      }
    });

    console.log("\n✅ Usuarios encontrados con sus roles:");
    console.log(JSON.stringify(usuarios, null, 2));
  } catch (error) {
    console.error("\n❌ Error al obtener usuarios:", error.message);
  }
}

probarUsuarios();
