const GestorUsuarios = require("../services/GestorUsuarios");

// Registrar un usario
exports.registrarUsuario = async (req, res) => {
  try {

    const usuario = await GestorUsuarios.registrarUsuario(req.body);
    res.status(201).json({ mensaje: "Usuario creado existosamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerusuarios = async (req, res) => {
  try {
    const usuarios = await GestorUsuarios.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
exports.obtenerusuarioPorId = async (req, res) => {
  try {
    const usuario = await GestorUsuarios.obtenerUsuarioPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Modificar usuario
exports.modificarUsuario = async (req, res) => {
    try {
      const usuario = await GestorUsuarios.modificarUsuario(req.params.id, req.body);
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  // Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
    try {
      const { passwordActual, nuevaPassword } = req.body;
      const respuesta = await GestorUsuarios.cambiarPassword(req.params.id, passwordActual, nuevaPassword);
      res.json(respuesta);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Desactivar usuario
exports.desactivarUsuario = async (req, res) => {
  try {
    const respuesta = await GestorUsuarios.desactivarUsuario(req.params.id);
    res.json(respuesta);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};




