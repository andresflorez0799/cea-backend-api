const db = require("../config/db");

const CATEGORY_CODES = new Set(["A2", "B1", "B2", "B3", "C1", "C2", "C3"]);

function normalizePayload(payload = {}) {
  return {
    name: String(payload.name || "").trim(),
    plate: String(payload.plate || "").trim().toUpperCase(),
    vehicleType: String(payload.vehicleType || "").trim(),
    categoryCode: String(payload.categoryCode || "").trim().toUpperCase(),
    model: String(payload.model || "").trim(),
    color: String(payload.color || "").trim(),
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
  };
}

function validatePayload(payload) {
  const normalized = normalizePayload(payload);

  if (!normalized.name) {
    throw new Error("El nombre del vehículo es obligatorio.");
  }

  if (!normalized.plate) {
    throw new Error("La placa es obligatoria.");
  }

  if (!normalized.vehicleType) {
    throw new Error("El tipo de vehículo es obligatorio.");
  }

  if (!CATEGORY_CODES.has(normalized.categoryCode)) {
    throw new Error("La categoría del vehículo no es válida.");
  }

  if (!normalized.model) {
    throw new Error("El modelo del vehículo es obligatorio.");
  }

  if (!normalized.color) {
    throw new Error("El color del vehículo es obligatorio.");
  }

  return normalized;
}

function mapVehicle(row) {
  return {
    id: row.id,
    name: row.name,
    plate: row.plate,
    vehicleType: row.vehicle_type,
    categoryCode: row.category_code,
    model: row.model,
    color: row.color,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listVehicles() {
  const result = await db.query(
    `SELECT id, name, plate, vehicle_type, category_code, model, color, is_active, created_at, updated_at
     FROM vehicles
     ORDER BY created_at DESC, name ASC`
  );
  return result.rows.map(mapVehicle);
}

async function createVehicle(payload) {
  const normalized = validatePayload(payload);

  try {
    const result = await db.query(
      `INSERT INTO vehicles (
        name, plate, vehicle_type, category_code, model, color, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
      RETURNING id, name, plate, vehicle_type, category_code, model, color, is_active, created_at, updated_at`,
      [
        normalized.name,
        normalized.plate,
        normalized.vehicleType,
        normalized.categoryCode,
        normalized.model,
        normalized.color,
      ]
    );
    return mapVehicle(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un vehículo registrado con esa placa.");
    }
    throw error;
  }
}

async function updateVehicle(vehicleId, payload) {
  const existing = await db.query(`SELECT id FROM vehicles WHERE id = $1`, [vehicleId]);
  if (existing.rowCount === 0) {
    throw new Error("Vehículo no encontrado.");
  }

  const normalized = validatePayload(payload);

  try {
    const result = await db.query(
      `UPDATE vehicles
       SET name = $1,
           plate = $2,
           vehicle_type = $3,
           category_code = $4,
           model = $5,
           color = $6,
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $8
       RETURNING id, name, plate, vehicle_type, category_code, model, color, is_active, created_at, updated_at`,
      [
        normalized.name,
        normalized.plate,
        normalized.vehicleType,
        normalized.categoryCode,
        normalized.model,
        normalized.color,
        normalized.isActive,
        vehicleId,
      ]
    );
    return mapVehicle(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Ya existe un vehículo registrado con esa placa.");
    }
    throw error;
  }
}

async function disableVehicle(vehicleId) {
  const result = await db.query(
    `UPDATE vehicles
     SET is_active = false, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, plate, vehicle_type, category_code, model, color, is_active, created_at, updated_at`,
    [vehicleId]
  );

  if (result.rowCount === 0) {
    throw new Error("Vehículo no encontrado.");
  }

  return mapVehicle(result.rows[0]);
}

module.exports = {
  listVehicles,
  createVehicle,
  updateVehicle,
  disableVehicle,
};
