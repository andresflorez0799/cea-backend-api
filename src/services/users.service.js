const db = require("../config/db");
const { comparePassword, hashPassword } = require("../utils/password");

async function getCurrentUser(userId) {
  const result = await db.query(
    `SELECT id, full_name, email, role
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return {
    id: result.rows[0].id,
    fullName: result.rows[0].full_name,
    email: result.rows[0].email,
    role: result.rows[0].role,
  };
}

async function changePassword(userId, currentPassword, newPassword) {
  const result = await db.query(
    `SELECT id, password_hash FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Usuario no encontrado.");
  }

  const isValid = await comparePassword(currentPassword, result.rows[0].password_hash);
  if (!isValid) {
    throw new Error("La contraseña actual no es válida.");
  }

  const newHash = await hashPassword(newPassword);

  await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newHash, userId]
  );

  return { message: "Contraseña actualizada correctamente." };
}

module.exports = {
  getCurrentUser,
  changePassword,
};