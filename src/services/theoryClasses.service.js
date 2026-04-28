const db = require("../config/db");

const CATEGORY_CODES = new Set(["A2", "B1", "B2", "B3", "C1", "C2", "C3"]);

function normalizePayload(payload = {}) {
  return {
    topic: String(payload.topic || "").trim(),
    description: String(payload.description || "").trim(),
    date: String(payload.date || "").trim(),
    time: String(payload.time || "").trim(),
    category: String(payload.category || "").trim().toUpperCase(),
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
  };
}

function validatePayload(payload) {
  const normalized = normalizePayload(payload);

  if (!normalized.topic) {
    throw new Error("El tema de la clase teórica es obligatorio.");
  }

  if (!normalized.description) {
    throw new Error("La descripción de la clase teórica es obligatoria.");
  }

  if (!normalized.date) {
    throw new Error("La fecha de la clase teórica es obligatoria.");
  }

  if (!normalized.time) {
    throw new Error("La hora de la clase teórica es obligatoria.");
  }

  if (!CATEGORY_CODES.has(normalized.category)) {
    throw new Error("La categoría de la clase teórica no es válida.");
  }

  return normalized;
}

function mapTheoryClass(row) {
  return {
    id: row.id,
    topic: row.topic,
    description: row.description,
    date: row.date,
    time: row.time,
    category: row.category,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getTheoryClasses(userRole) {
  const onlyActive = userRole !== "Admin";

  const result = await db.query(
    `SELECT
        id,
        topic,
        description,
        class_date AS date,
        class_time AS time,
        category,
        is_active,
        created_at,
        updated_at
     FROM theory_classes
     ${onlyActive ? "WHERE is_active = true" : ""}
     ORDER BY class_date ASC, class_time ASC`
  );

  return result.rows.map(mapTheoryClass);
}

async function createTheoryClass(payload) {
  const normalized = validatePayload(payload);

  const result = await db.query(
    `INSERT INTO theory_classes (
      topic, description, class_date, class_time, category, is_active, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
    RETURNING
      id,
      topic,
      description,
      class_date AS date,
      class_time AS time,
      category,
      is_active,
      created_at,
      updated_at`,
    [
      normalized.topic,
      normalized.description,
      normalized.date,
      normalized.time,
      normalized.category,
    ]
  );

  return mapTheoryClass(result.rows[0]);
}

async function updateTheoryClass(theoryClassId, payload) {
  const existing = await db.query(`SELECT id FROM theory_classes WHERE id = $1`, [theoryClassId]);

  if (existing.rowCount === 0) {
    throw new Error("Clase teórica no encontrada.");
  }

  const normalized = validatePayload(payload);

  const result = await db.query(
    `UPDATE theory_classes
     SET topic = $1,
         description = $2,
         class_date = $3,
         class_time = $4,
         category = $5,
         is_active = COALESCE($6, is_active),
         updated_at = NOW()
     WHERE id = $7
     RETURNING
       id,
       topic,
       description,
       class_date AS date,
       class_time AS time,
       category,
       is_active,
       created_at,
       updated_at`,
    [
      normalized.topic,
      normalized.description,
      normalized.date,
      normalized.time,
      normalized.category,
      normalized.isActive,
      theoryClassId,
    ]
  );

  return mapTheoryClass(result.rows[0]);
}

async function disableTheoryClass(theoryClassId) {
  const result = await db.query(
    `UPDATE theory_classes
     SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING
       id,
       topic,
       description,
       class_date AS date,
       class_time AS time,
       category,
       is_active,
       created_at,
       updated_at`,
    [theoryClassId]
  );

  if (result.rowCount === 0) {
    throw new Error("Clase teórica no encontrada.");
  }

  return mapTheoryClass(result.rows[0]);
}

module.exports = {
  getTheoryClasses,
  createTheoryClass,
  updateTheoryClass,
  disableTheoryClass,
};
