const db = require("../config/db");

async function getSchedulingResources() {
  const instructorsResult = await db.query(
    `SELECT id, full_name, license_category_code
     FROM instructors
     WHERE is_active = true
     ORDER BY full_name ASC`
  );

  const vehiclesResult = await db.query(
    `SELECT id, name, plate, category_code
     FROM vehicles
     WHERE is_active = true
     ORDER BY name ASC`
  );

  return {
    instructors: instructorsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      licenseCategoryCode: row.license_category_code,
    })),
    vehicles: vehiclesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      plate: row.plate,
      categoryCode: row.category_code,
    })),
  };
}

async function getAvailableSchedulingOptions({ date, time }) {
  if (!date || !time) {
    const error = new Error("Fecha y hora son obligatorias para consultar disponibilidad.");
    error.statusCode = 400;
    throw error;
  }

  const instructorsResult = await db.query(
    `SELECT i.id, i.full_name, i.license_category_code
     FROM instructors i
     WHERE i.is_active = true
       AND NOT EXISTS (
         SELECT 1
         FROM practical_classes pc
         WHERE pc.instructor_id = i.id
           AND pc.class_date = $1
           AND pc.class_time = $2
           AND pc.status = 'Activa'
       )
     ORDER BY i.full_name ASC`,
    [date, time]
  );

  const vehiclesResult = await db.query(
    `SELECT v.id, v.name, v.plate, v.category_code
     FROM vehicles v
     WHERE v.is_active = true
       AND NOT EXISTS (
         SELECT 1
         FROM practical_classes pc
         WHERE pc.vehicle_id = v.id
           AND pc.class_date = $1
           AND pc.class_time = $2
           AND pc.status = 'Activa'
       )
     ORDER BY v.name ASC`,
    [date, time]
  );

  return {
    date,
    time,
    instructors: instructorsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      licenseCategoryCode: row.license_category_code,
    })),
    vehicles: vehiclesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      plate: row.plate,
      categoryCode: row.category_code,
    })),
  };
}

module.exports = {
  getSchedulingResources,
  getAvailableSchedulingOptions,
};
