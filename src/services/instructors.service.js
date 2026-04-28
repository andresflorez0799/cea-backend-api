const db = require("../config/db");

const LICENSE_CATEGORY_CODES = new Set(["A2", "B1", "B2", "B3", "C1", "C2", "C3"]);

function normalizePayload(payload = {}) {
  return {
    fullName: String(payload.fullName || "").trim(),
    email: String(payload.email || "").trim().toLowerCase(),
    phone: String(payload.phone || "").trim(),
    licenseCategoryCode: String(payload.licenseCategoryCode || "").trim().toUpperCase(),
    profilePhoto: typeof payload.profilePhoto === "string" ? payload.profilePhoto.trim() : "",
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
  };
}

function validatePayload(payload) {
  const normalized = normalizePayload(payload);

  if (!normalized.fullName) {
    throw new Error("El nombre del instructor es obligatorio.");
  }

  if (!normalized.email) {
    throw new Error("El correo del instructor es obligatorio.");
  }

  if (!normalized.phone) {
    throw new Error("El teléfono del instructor es obligatorio.");
  }

  if (!LICENSE_CATEGORY_CODES.has(normalized.licenseCategoryCode)) {
    throw new Error("La categoría de licencia del instructor no es válida.");
  }

  if (normalized.profilePhoto && !normalized.profilePhoto.startsWith("data:image/")) {
    throw new Error("La foto debe enviarse como una imagen válida en formato base64.");
  }

  return normalized;
}

function mapInstructor(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    licenseCategoryCode: row.license_category_code,
    profilePhoto: row.profile_photo,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listInstructors() {
  const result = await db.query(
    `SELECT id, full_name, email, phone, license_category_code, profile_photo, is_active, created_at, updated_at
     FROM instructors
     ORDER BY created_at DESC, full_name ASC`
  );
  return result.rows.map(mapInstructor);
}

async function createInstructor(payload) {
  const normalized = validatePayload(payload);
  try {
    const result = await db.query(
      `INSERT INTO instructors (
        full_name, email, phone, license_category_code, profile_photo, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      RETURNING id, full_name, email, phone, license_category_code, profile_photo, is_active, created_at, updated_at`,
      [
        normalized.fullName,
        normalized.email,
        normalized.phone,
        normalized.licenseCategoryCode,
        normalized.profilePhoto || null,
      ]
    );
    return mapInstructor(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un instructor registrado con ese correo.");
    }
    throw error;
  }
}

async function updateInstructor(instructorId, payload) {
  const existing = await db.query(`SELECT id FROM instructors WHERE id = $1`, [instructorId]);
  if (existing.rowCount === 0) {
    throw new Error("Instructor no encontrado.");
  }

  const normalized = validatePayload(payload);
  try {
    const result = await db.query(
      `UPDATE instructors
       SET full_name = $1,
           email = $2,
           phone = $3,
           license_category_code = $4,
           profile_photo = $5,
           is_active = COALESCE($6, is_active),
           updated_at = NOW()
       WHERE id = $7
       RETURNING id, full_name, email, phone, license_category_code, profile_photo, is_active, created_at, updated_at`,
      [
        normalized.fullName,
        normalized.email,
        normalized.phone,
        normalized.licenseCategoryCode,
        normalized.profilePhoto || null,
        normalized.isActive,
        instructorId,
      ]
    );
    return mapInstructor(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un instructor registrado con ese correo.");
    }
    throw error;
  }
}

async function disableInstructor(instructorId) {
  const result = await db.query(
    `UPDATE instructors
     SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING id, full_name, email, phone, license_category_code, profile_photo, is_active, created_at, updated_at`,
    [instructorId]
  );

  if (result.rowCount === 0) {
    throw new Error("Instructor no encontrado.");
  }

  return mapInstructor(result.rows[0]);
}

module.exports = {
  listInstructors,
  createInstructor,
  updateInstructor,
  disableInstructor,
};
