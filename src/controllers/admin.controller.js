const db = require("../config/db");

async function getSummary(req, res, next) {
  try {
    const [instructors, vehicles, params, todayClasses, activeStudents] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS total FROM instructors WHERE is_active = true`),
      db.query(`SELECT COUNT(*)::int AS total FROM vehicles WHERE is_active = true`),
      db.query(`SELECT max_practical_hours FROM system_parameters LIMIT 1`),
      db.query(`SELECT COUNT(*)::int AS total FROM practical_classes WHERE class_date = CURRENT_DATE`),
      db.query(`SELECT COUNT(*)::int AS total FROM users WHERE role = 'Student' AND is_active = true`),
    ]);

    return res.json({
      activeInstructors: instructors.rows[0].total,
      availableVehicles: vehicles.rows[0].total,
      maxPracticalHours: params.rows[0]?.max_practical_hours || 20,
      todayClasses: todayClasses.rows[0].total,
      activeStudents: activeStudents.rows[0].total,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
};
