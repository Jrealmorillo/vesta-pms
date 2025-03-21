module.exports = function (rolRequerido) {
    return (req, res, next) => {
      if (!req.usuario || req.usuario.id_rol !== rolRequerido) {
        return res.status(403).json({ error: "Acceso restringido: permisos insuficientes" });
      }
      next();
    };
  };
  