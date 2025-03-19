const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Obtener el token del encabezado "Authorization"
  const token = req.header("Authorization");

  // Si no se proporciona un token, se deniega el acceso
  if (!token) {
    return res
      .status(401) // 401 = No autorizado
      .json({ error: "Acceso denegado, token no proporcionado" });
  }

  try {
    const claveSecreta = process.env.JWT_SECRET; // Se obtiene la clave secreta desde las variables de entorno

    // Se verifica y decodifica el token (eliminando "Bearer " si está presente)
    const usuarioVerificado = jwt.verify(
      token.replace("Bearer ", ""),
      claveSecreta
    );

    req.usuario = usuarioVerificado; // Se almacena la info del usuario en la petición para su uso posterior
    next(); // Se pasa el control al siguiente middleware o ruta
  } catch (error) {
    res.status(403).json({ error: "Token inválido" }); // 403 = Prohibido (token incorrecto o caducado)
  }
};
