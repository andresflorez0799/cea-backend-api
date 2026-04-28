const db = require("../config/db");
const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function login(email, password) {
  const result = await db.query(
    `SELECT id, full_name, first_name, last_name, address, email, phone, password_hash, role,
            enrollment_category, license_category_code, profile_photo, is_active
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
      firstName: user.first_name,
      lastName: user.last_name,
      address: user.address,
      email: user.email,
      phone: user.phone,
      role: user.role,
      enrollmentCategory: user.enrollment_category,
      licenseCategoryCode: user.license_category_code,
      profilePhoto: user.profile_photo,
      isActive: user.is_active,
    },
  };
}

module.exports = {
  login,
};
