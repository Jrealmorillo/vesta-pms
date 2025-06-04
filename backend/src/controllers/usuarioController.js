// Controlador para gestionar las operaciones relacionadas con usuarios.
// Utiliza el servicio GestorUsuarios para la lógica de negocio y responde a las peticiones HTTP.

const GestorUsuarios = require("../services/GestorUsuarios");

exports.registrarUsuario = async (req, res) => {
  try {
    // Registra un nuevo usuario con los datos recibidos en el cuerpo de la petición
    const usuario = await GestorUsuarios.registrarUsuario(req.body);
    // Devuelve el usuario creado y un mensaje de éxito
    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: usuario
    });
  } catch (error) {
    // Devuelve un error detallado si la operación falla
    res.status(500).json({
      error: "Error al registrar usuario",
      detalle: error.message // Se envía el detalle del error para facilitar depuración
    });
  }
};

exports.obtenerusuarios = async (req, res) => {
  try {
    // Obtiene todos los usuarios registrados
    const usuarios = await GestorUsuarios.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    // Log de error para depuración y respuesta de error genérica
    console.error("Error en obtenerUsuarios:", error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.obtenerusuarioPorId = async (req, res) => {
  try {
    // Busca un usuario por su ID
    const usuario = await GestorUsuarios.obtenerUsuarioPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    // Devuelve un error 404 si no se encuentra el usuario
    res.status(404).json({ error: error.message });
  }
};

exports.modificarUsuario = async (req, res) => {
  try {
    // Modifica un usuario existente identificado por su ID
    const usuario = await GestorUsuarios.modificarUsuario(req.params.id, req.body);
    // Devuelve el usuario modificado y un mensaje de éxito
    res.json({
      mensaje: "Usuario modificado exitosamente",
      usuario: usuario
    });
  } catch (error) {
    // Devuelve un error si el usuario no se encuentra
    res.status(404).json({ error: error.message });
  }
};

exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    // Verifica que se proporcionen ambas contraseñas en la solicitud
    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({ error: "Ambas contraseñas son obligatorias" });
    }
    // Cambia la contraseña del usuario si las credenciales son correctas
    const respuesta = await GestorUsuarios.cambiarPassword(
      req.params.id,
      passwordActual,
      nuevaPassword
    );
    res.json(respuesta);
  } catch (error) {
    // Devuelve un error si la operación falla
    res.status(400).json({ error: error.message });
  }
};

exports.desactivarUsuario = async (req, res) => {
  try {
    // Desactiva (inhabilita) un usuario por su ID
    const respuesta = await GestorUsuarios.desactivarUsuario(req.params.id);
    res.json(respuesta);
  } catch (error) {
    // Devuelve un error si el usuario no se encuentra
    res.status(404).json({ error: error.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;
    // Verifica que se envíen el nombre de usuario y la contraseña en la solicitud
    if (!nombre_usuario || !contraseña) {
      return res.status(400).json({ error: "Nombre de usuario y contraseña obligatorios" });
    }
    // Realiza el login y devuelve los datos del usuario autenticado
    const datosLogin = await GestorUsuarios.loginUsuario(nombre_usuario, contraseña);
    res.json(datosLogin);
  } catch (error) {
    // Devuelve error 401 si las credenciales no son correctas
    res.status(401).json({ error: error.message });
  }
};
