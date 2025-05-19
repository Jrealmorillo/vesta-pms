// Middleware de autenticación JWT para proteger rutas privadas.
// Verifica el token enviado en el encabezado Authorization y añade el usuario verificado al objeto req.

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extrae el token del encabezado "Authorization" (formato: Bearer <token>)
  const token = req.header("Authorization")?.split(" ")[1];

  // Si no se proporciona un token, se deniega el acceso
  if (!token) {
    return res
      .status(401) // 401 = No autorizado
      .json({ error: "Acceso denegado, token no proporcionado" });
  }

  try {
    // Obtiene la clave secreta desde las variables de entorno
    const claveSecreta = process.env.JWT_SECRET;

    // Verifica y decodifica el token JWT
    const usuarioVerificado = jwt.verify(
      token.replace("Bearer ", ""),
      claveSecreta
    );
    // Añade el usuario verificado al objeto req para su uso en rutas protegidas
    req.usuario = {
      ...usuarioVerificado,
      nombre_usuario: usuarioVerificado.nombre_usuario,
    };

    next(); // Pasa el control al siguiente middleware o ruta
  } catch (error) {
    // Si el token es inválido o ha expirado, deniega el acceso
    res.status(403).json({ error: "Token inválido" }); // 403 = Prohibido
  }
};
