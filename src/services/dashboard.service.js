const db = require("../config/db");

async function getDashboard(userId) {
  const hoursResult = await db.query(
    `SELECT
        COALESCE(SUM(CASE WHEN status = 'Activa' THEN 1 ELSE 0 END), 0) AS scheduled_classes,
        COALESCE(SUM(CASE WHEN status = 'Completada' THEN 1 ELSE 0 END), 0) AS completed_classes
     FROM practical_classes
     WHERE user_id = $1`,
    [userId]
  );

  const nextClassResult = await db.query(
    `SELECT class_date, class_time
     FROM practical_classes
     WHERE user_id = $1 AND status = 'Activa'
     ORDER BY class_date ASC, class_time ASC
     LIMIT 1`,
    [userId]
  );

  const configResult = await db.query(
    `SELECT max_practical_hours FROM system_parameters LIMIT 1`
  );

  const scheduled = Number(hoursResult.rows[0].scheduled_classes || 0);
  const completed = Number(hoursResult.rows[0].completed_classes || 0);
  const total = Number(configResult.rows[0]?.max_practical_hours || 20);
  const progress = Math.min(Math.round(((completed || 0) / total) * 100), 100);

  const nextClass = nextClassResult.rowCount
    ? `${nextClassResult.rows[0].class_date} ${nextClassResult.rows[0].class_time}`
    : null;

  return {
    stats: [
      { label: "Clases programadas", value: String(scheduled) },
      { label: "Progreso", value: `${progress}%` },
      { label: "Horas pendientes", value: String(Math.max(total - completed, 0)) },
    ],
    progress,
    enrollmentStatus: "Activa",
    practicalHoursTaken: completed,
    practicalHoursTotal: total,
    nextClassDate: nextClass,
  };
}

module.exports = {
  getDashboard,
};