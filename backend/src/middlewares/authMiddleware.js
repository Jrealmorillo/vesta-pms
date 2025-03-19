const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado, token no proporcionado" });
  }

  try {
    const claveSecreta = process.env.JWT_SECRET;
    const usuarioVerificado = jwt.verify(
      token.replace("Bearer ", ""),
      claveSecreta
    );
    req.usuario = usuarioVerificado;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
};
