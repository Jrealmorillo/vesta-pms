const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

class GestorUsuarios {
  async registrarUsuario(datos) {
    try {
      const { nombre, nombre_usuario, email, contraseña, id_rol, activo } =
        datos;

      // Verificar si el usuario ya existe en la base de datos
      const usuarioExistente = await Usuario.findOne({
        where: { nombre_usuario },
      });
      if (usuarioExistente) {
        throw new Error("El nombre de usuario ya está en uso");
      }

      // Cifrar la contraseña antes de guardarla en la base de datos
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(contraseña, salt);

      // Crear el nuevo usuario con los datos proporcionados
      return await Usuario.create({
        nombre,
        nombre_usuario,
        email,
        contraseña: hashedPassword, // Se almacena la contraseña cifrada
        id_rol: id_rol || 2, // Si no se proporciona, se asigna el rol por defecto (2)
        activo: activo !== undefined ? activo : true, // Por defecto, el usuario está activo
      });
    } catch (error) {
      throw new Error("Error al registrar usuario: " + error.message);
    }
  }

  async obtenerUsuarios() {
    try {
      return await Usuario.findAll();
    } catch (error) {
      throw new Error("Error al obtener usuarios: " + error.message);
    } // Retorna todos los usuarios de la base de datos
  }

  async obtenerUsuarioPorId(id) {
    try {
      const usuario = await Usuario.findByPk(id); // Busca el usuario por ID
      if (!usuario) throw new Error("Usuario no encontrado");
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener el usuario: " + error.message);
    }
  }

  async modificarUsuario(id, nuevosDatos) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new Error("Usuario no encontrado");

      // Actualiza los datos del usuario con la nueva información
      await usuario.update(nuevosDatos);
      return usuario;
    } catch (error) {
      throw new Error("Error al modificar el usuario: " + error.message);
    }
  }

  async cambiarPassword(id, passwordActual, nuevaPassword) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new Error("Usuario no encontrado");

      // Verifica si la contraseña actual es correcta
      const passwordValida = await bcrypt.compare(
        passwordActual,
        usuario.contraseña
      );
      if (!passwordValida) throw new Error("Contraseña actual incorrecta");

      // Cifra la nueva contraseña antes de actualizarla
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(nuevaPassword, salt);
      await usuario.update({ contraseña: hashedPassword });

      return { mensaje: "Contraseña actualizada correctamente" };
    } catch (error) {
      throw new Error("Error al cambiar la contraseña: " + error.message);
    }
  }

  async desactivarUsuario(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) throw new Error("Usuario no encontrado");

      // Se cambia el estado del usuario a inactivo en lugar de eliminarlo
      await usuario.update({ activo: false });
      return { mensaje: "Usuario desactivado correctamente" };
    } catch (error) {
      throw new Error("Error al desactivar usuario: " + error.message);
    }
  }

  async loginUsuario(nombre_usuario, contraseña) {
    try {
      const usuario = await Usuario.findOne({ where: { nombre_usuario } });
      if (!usuario) {
        throw new Error("Usuario incorrecto");
      }

      // Verifica si la contraseña ingresada es válida
      const passwordValida = await bcrypt.compare(
        contraseña,
        usuario.contraseña
      );
      if (!passwordValida) {
        throw new Error("Contraseña incorrecta");
      }

      // Genera un token JWT para la autenticación del usuario
      const token = jwt.sign(
        {
          id: usuario.id_usuario, // Se asegura de usar el campo correcto
          nombre_usuario: usuario.nombre_usuario,
          id_rol: usuario.id_rol,
        },
        process.env.JWT_SECRET // Clave secreta para firmar el token
      );

      return {
        token,
        usuario: {
          id: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          id_rol: usuario.id_rol,
        },
      };
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  }
}

module.exports = new GestorUsuarios(); // Exporta una instancia única de la clase
