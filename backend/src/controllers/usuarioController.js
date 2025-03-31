const GestorUsuarios = require("../services/GestorUsuarios");

// Registrar un usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const usuario = await GestorUsuarios.registrarUsuario(req.body);
    res.status(201).json({ 
      mensaje: "Usuario creado exitosamente", 
      usuario: usuario 
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Error al registrar usuario", 
      detalle: error.message // Se envía el detalle del error para facilitar depuración
    });
  }
};

// Obtener todos los usuarios
exports.obtenerusuarios = async (req, res) => {
  try {
    const usuarios = await GestorUsuarios.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error en obtenerUsuarios:", error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
exports.obtenerusuarioPorId = async (req, res) => {
  try {
    const usuario = await GestorUsuarios.obtenerUsuarioPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message }); // Devuelve un error 404 si no se encuentra el usuario
  }
};

// Modificar usuario
exports.modificarUsuario = async (req, res) => {
  try {
    const usuario = await GestorUsuarios.modificarUsuario(req.params.id, req.body);
    res.json({
      mensaje: "Usuario modificado exitosamente", 
      usuario: usuario 
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    
    // Verifica que se proporcionen ambas contraseñas en la solicitud
    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({ error: "Ambas contraseñas son obligatorias" });
    }

    const respuesta = await GestorUsuarios.cambiarPassword(
      req.params.id,
      passwordActual,
      nuevaPassword
    );
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

// Iniciar sesión (Login)
exports.loginUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;

    // Verifica que se envíen el nombre de usuario y la contraseña en la solicitud
    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: "Nombre de usuario y contraseña obligatorios" });
    }

    const datosLogin = await GestorUsuarios.loginUsuario(nombre_usuario, contraseña);
    res.json(datosLogin);
  } catch (error) {
    res.status(401).json({ error: error.message }); // Devuelve error 401 si las credenciales no son correctas
  }
};
