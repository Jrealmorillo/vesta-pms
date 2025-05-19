// Middleware para restringir el acceso a rutas según el rol del usuario.
// Solo permite el acceso si el usuario autenticado tiene el rol requerido.

module.exports = function (rolRequerido) {
  return (req, res, next) => {
    // Verifica que el usuario esté autenticado y tenga el rol adecuado
    if (!req.usuario || req.usuario.id_rol !== rolRequerido) {
      return res.status(403).json({ error: "Acceso restringido: permisos insuficientes" });
    }
    next(); // Permite el acceso si el rol es correcto
  };
};
