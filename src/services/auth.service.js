const db = require("../config/db");
const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function login(email, password) {

    console.log(email);
    console.log(password);

    const result = await db.query(
    `SELECT id, full_name, email, password_hash, role, is_active
     FROM users
     WHERE email = $1`,
    [email]
  );
 

  if (result.rowCount === 0) {
    throw new Error("Credenciales inválidas.");
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error("El usuario se encuentra inactivo.");
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw new Error("Credenciales inválidas.");
  }

  const accessToken = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = {
  login,
};