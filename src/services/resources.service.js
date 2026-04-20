const db = require("../config/db");

async function getSchedulingResources() {
  const instructorsResult = await db.query(
    `SELECT id, full_name FROM instructors WHERE is_active = true ORDER BY full_name ASC`
  );

  const vehiclesResult = await db.query(
    `SELECT id, name FROM vehicles WHERE is_active = true ORDER BY name ASC`
  );

  return {
    instructors: instructorsResult.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
    })),
    vehicles: vehiclesResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
    })),
  };
}

module.exports = {
  getSchedulingResources,
};