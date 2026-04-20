const { verifyToken } = require("../utils/jwt");
const db = require("../config/db");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const result = await db.query(
      `SELECT id, full_name, email, role
       FROM users
       WHERE id = $1 AND is_active = true`,
      [decoded.sub]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Usuario no autorizado." });
    }

    req.user = {
      id: result.rows[0].id,
      fullName: result.rows[0].full_name,
      email: result.rows[0].email,
      role: result.rows[0].role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}

module.exports = authMiddleware;