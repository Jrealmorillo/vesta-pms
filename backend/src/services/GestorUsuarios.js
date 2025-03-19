const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

class GestorUsuarios {
  async registrarUsuario(datos) {
    const { nombre, nombre_usuario, email, contraseña, id_rol, activo } = datos;

    // Verificar si el usuario ya está registrado
    const usuarioExistente = await Usuario.findOne({
      where: { nombre_usuario },
    });
    if (usuarioExistente) {
      throw new Error("El nombre de usuario ya está en uso");
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear usuario
    return await Usuario.create({
      nombre,
      nombre_usuario,
      email,
      contraseña: hashedPassword,
      id_rol: id_rol || 1,
      activo: activo !== undefined ? activo : true,
    });
  }

  async obtenerUsuarios() {
    return await Usuario.findAll();
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  }

  async modificarUsuario(id, nuevosDatos) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    await usuario.update(nuevosDatos);
    return usuario;
  }

  async cambiarPassword(id, passwordActual, nuevaPassword) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    const passwordValida = await bcrypt.compare(
      passwordActual,
      usuario.contraseña
    );
    if (!passwordValida) throw new Error("Contraseña actual incorrecta");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);
    await usuario.update({ contraseña: hashedPassword });

    return { mensaje: "Contraseña actualizada correctamente" };
  }

  async desactivarUsuario(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");
    await usuario.update({ activo: false });
    return { mensaje: "Usuario desactivado correctamente " };
  }

  async loginUsuario(nombre_usuario, contraseña) {
    const usuario = await Usuario.findOne({ where: { nombre_usuario } });
    if (!usuario) {
      throw new Error("Usuario incorrecto");
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValida) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        id_rol: usuario.id_rol,
      },
      process.env.JWT_SECRET || "clave_secreta",
      { expiresIn: "2h" }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        id_rol: usuario.id_rol,
      },
    };
  }
}

module.exports = new GestorUsuarios();
