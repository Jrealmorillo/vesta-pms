const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");


// Registrar un usario
exports.registrarUsuario = async (req, res) => {
    try {
        const {nombre, nombre_usuario, email, contraseña, id_rol, activo} = req.body;

        // Verificar que el usuario no existe en la BBDD
        const usuarioExistente = await Usuario.findOne({ where: { email }});
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // Crear el usuario en la BBDD
        const nuevoUsuario = await Usuario.create({
            nombre,
            nombre_usuario,
            email,
            contraseña,
            id_rol: id_rol || 1,
            activo: activo !== undefined ? activo: true
        });

        res.status(201).json({ mensaje: "Usuario creado existosamente", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario", detalle: error.message});
    }
};


// Obtener todos los usuarios
exports.obtenerusuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", detalle: error.message });
    }
};


// Obtener un usuario por ID
exports.obtenerusuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", detalle: error.message });
    }
};


// Desactivar usuario
exports.desactivarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        if (!usuario.activo) {
            return res.status(400).json({ error: "El usuario ya está desactivado" });
        }

        await usuario.update({ activo: false });

        res.json({ mensaje: "Usuario desactivado correctamente ", usuario});
        
    } catch (error) {
        res.status(500).json({ error: "Error al desactivar el usuario", detalle: error.message });
    }
}


// Modificar usuario
exports.modificarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, nombre_usuario, email } = req.body;
        
        const usuario = await Usuario.findByPk(id);

        if(!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await usuario.update({
            nombre: nombre || usuario.nombre,
            nombre_usuario: nombre_usuario || usuario.nombre_usuario,
            email: email || usuario.email
        });

        res.json({ mensaje: "Usuario actualizado correctamente ", usuario});
    } catch (error) {
        res.status(500).json ({ error: "Error al actualizar el usuario", detalle: error.message})
    }
};


// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { contraseña_actual, nueva_contraseña } = req.body;

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findByPk(id);

        // Si el usuario no existe
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar que la contraseña actual sea correcta
        const contraseñaValida = await bcrypt.compare(contraseña_actual, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: "Contraseña actual incorrecta" });
        }

        // Encriptar la nueva contraseña
        const contraseñaEncriptada = await bcrypt.hash(nueva_contraseña, 10);

        // Actualizar la contraseña en la base de datos
        await usuario.update({ contraseña: contraseñaEncriptada });

        res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la contraseña", detalle: error.message });
    }
};