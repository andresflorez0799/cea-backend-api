const db = require("../config/db");
const { comparePassword, hashPassword } = require("../utils/password");

const ENROLLMENT_CATEGORIES = new Set(["A", "A_B", "A_C"]);
const LICENSE_CATEGORY_CODES = new Set(["A2", "B1", "B2", "B3", "C1", "C2", "C3"]);

function buildFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
}

function normalizePayload(payload = {}) {
  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const address = String(payload.address || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const phone = String(payload.phone || "").trim();
  const role = String(payload.role || "Student").trim() || "Student";
  const enrollmentCategory = String(payload.enrollmentCategory || "").trim().toUpperCase();
  const licenseCategoryCode = String(payload.licenseCategoryCode || "").trim().toUpperCase();
  const profilePhoto = typeof payload.profilePhoto === "string" ? payload.profilePhoto.trim() : "";

  return {
    firstName,
    lastName,
    address,
    email,
    phone,
    role,
    enrollmentCategory,
    licenseCategoryCode,
    profilePhoto,
    password: payload.password,
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
  };
}

function validateUserPayload(payload, { isUpdate = false } = {}) {
  const normalized = normalizePayload(payload);

  if (!normalized.firstName) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!normalized.lastName) {
    throw new Error("El apellido es obligatorio.");
  }

  if (!normalized.email) {
    throw new Error("El correo es obligatorio.");
  }

  if (!normalized.address) {
    throw new Error("La dirección es obligatoria.");
  }

  if (!normalized.phone) {
    throw new Error("El teléfono es obligatorio.");
  }

  if (!ENROLLMENT_CATEGORIES.has(normalized.enrollmentCategory)) {
    throw new Error("La categoría de matrícula no es válida.");
  }

  if (!LICENSE_CATEGORY_CODES.has(normalized.licenseCategoryCode)) {
    throw new Error("La subcategoría de licencia no es válida.");
  }

  if (!isUpdate && (!normalized.password || String(normalized.password).trim().length < 6)) {
    throw new Error("La contraseña es obligatoria y debe tener mínimo 6 caracteres.");
  }

  if (normalized.password && String(normalized.password).trim().length < 6) {
    throw new Error("La contraseña debe tener mínimo 6 caracteres.");
  }

  if (normalized.profilePhoto && !normalized.profilePhoto.startsWith("data:image/")) {
    throw new Error("La foto debe enviarse como una imagen válida en formato base64.");
  }

  return normalized;
}

function mapUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    firstName: row.first_name,
    lastName: row.last_name,
    address: row.address,
    email: row.email,
    phone: row.phone,
    role: row.role,
    enrollmentCategory: row.enrollment_category,
    licenseCategoryCode: row.license_category_code,
    profilePhoto: row.profile_photo,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getCurrentUser(userId) {
  const result = await db.query(
    `SELECT id, full_name, first_name, last_name, address, email, phone, role,
            enrollment_category, license_category_code, profile_photo, is_active,
            created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Usuario no encontrado.");
  }

  return mapUser(result.rows[0]);
}

async function listUsers() {
  const result = await db.query(
    `SELECT id, full_name, first_name, last_name, address, email, phone, role,
            enrollment_category, license_category_code, profile_photo, is_active,
            created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows.map(mapUser);
}

async function createUser(payload) {
  const normalized = validateUserPayload(payload);
  const fullName = buildFullName(normalized.firstName, normalized.lastName);
  const passwordHash = await hashPassword(String(normalized.password).trim());

  try {
    const result = await db.query(
      `INSERT INTO users (
        full_name, first_name, last_name, address, email, phone, password_hash, role,
        enrollment_category, license_category_code, profile_photo, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())
      RETURNING id, full_name, first_name, last_name, address, email, phone, role,
                enrollment_category, license_category_code, profile_photo, is_active,
                created_at, updated_at`,
      [
        fullName,
        normalized.firstName,
        normalized.lastName,
        normalized.address,
        normalized.email,
        normalized.phone,
        passwordHash,
        normalized.role,
        normalized.enrollmentCategory,
        normalized.licenseCategoryCode,
        normalized.profilePhoto || null,
      ]
    );

    return mapUser(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un usuario registrado con ese correo.");
    }
    throw error;
  }
}

async function updateUser(userId, payload) {
  const existing = await db.query(
    `SELECT id, password_hash, profile_photo
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (existing.rowCount === 0) {
    throw new Error("Usuario no encontrado.");
  }

  const normalized = validateUserPayload(payload, { isUpdate: true });
  const fullName = buildFullName(normalized.firstName, normalized.lastName);
  const passwordHash = normalized.password
    ? await hashPassword(String(normalized.password).trim())
    : existing.rows[0].password_hash;

  try {
    const result = await db.query(
      `UPDATE users
       SET full_name = $1,
           first_name = $2,
           last_name = $3,
           address = $4,
           email = $5,
           phone = $6,
           password_hash = $7,
           role = $8,
           enrollment_category = $9,
           license_category_code = $10,
           profile_photo = $11,
           is_active = COALESCE($12, is_active),
           updated_at = NOW()
       WHERE id = $13
       RETURNING id, full_name, first_name, last_name, address, email, phone, role,
                 enrollment_category, license_category_code, profile_photo, is_active,
                 created_at, updated_at`,
      [
        fullName,
        normalized.firstName,
        normalized.lastName,
        normalized.address,
        normalized.email,
        normalized.phone,
        passwordHash,
        normalized.role,
        normalized.enrollmentCategory,
        normalized.licenseCategoryCode,
        normalized.profilePhoto || null,
        normalized.isActive,
        userId,
      ]
    );

    return mapUser(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un usuario registrado con ese correo.");
    }
    throw error;
  }
}

async function disableUser(userId) {
  const result = await db.query(
    `UPDATE users
     SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING id, full_name, first_name, last_name, address, email, phone, role,
               enrollment_category, license_category_code, profile_photo, is_active,
               created_at, updated_at`,
    [userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Usuario no encontrado.");
  }

  return mapUser(result.rows[0]);
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
  listUsers,
  createUser,
  updateUser,
  disableUser,
  changePassword,
};
