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

module.exports = {
  getSchedulingResources,
};
