const db = require("../config/db");

async function getPracticalClasses(userId) {
  const result = await db.query(
    `SELECT pc.id,
            pc.class_date AS date,
            pc.class_time AS time,
            i.full_name AS instructor_name,
            v.name AS vehicle_name,
            pc.status
     FROM practical_classes pc
     INNER JOIN instructors i ON i.id = pc.instructor_id
     INNER JOIN vehicles v ON v.id = pc.vehicle_id
     WHERE pc.user_id = $1
     ORDER BY pc.class_date ASC, pc.class_time ASC`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    date: row.date,
    time: row.time,
    instructorName: row.instructor_name,
    vehicleName: row.vehicle_name,
    status: row.status,
  }));
}

async function createPracticalClass(userId, payload) {
  const { date, time, instructorId, vehicleId } = payload;

  const paramsResult = await db.query(`SELECT max_practical_hours FROM system_parameters LIMIT 1`);
  const takenResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM practical_classes
     WHERE user_id = $1 AND status IN ('Activa', 'Completada')`,
    [userId]
  );

  const maxHours = Number(paramsResult.rows[0]?.max_practical_hours || 20);
  const takenHours = Number(takenResult.rows[0]?.total || 0);

  if (takenHours >= maxHours) {
    throw new Error("Has alcanzado el número máximo de horas prácticas permitidas.");
  }

  const availabilityResult = await db.query(
    `SELECT id
     FROM practical_classes
     WHERE class_date = $1
       AND class_time = $2
       AND status = 'Activa'
       AND (instructor_id = $3 OR vehicle_id = $4)`,
    [date, time, instructorId, vehicleId]
  );

  if (availabilityResult.rowCount > 0) {
    throw new Error("El instructor o el vehículo ya se encuentran ocupados en ese horario.");
  }

  const result = await db.query(
    `INSERT INTO practical_classes (user_id, instructor_id, vehicle_id, class_date, class_time, status)
     VALUES ($1, $2, $3, $4, $5, 'Activa')
     RETURNING id, class_date AS date, class_time AS time, status`,
    [userId, instructorId, vehicleId, date, time]
  );

  const detailResult = await db.query(
    `SELECT i.full_name AS instructor_name, v.name AS vehicle_name
     FROM instructors i, vehicles v
     WHERE i.id = $1 AND v.id = $2`,
    [instructorId, vehicleId]
  );

  return {
    id: result.rows[0].id,
    date: result.rows[0].date,
    time: result.rows[0].time,
    status: result.rows[0].status,
    instructorName: detailResult.rows[0].instructor_name,
    vehicleName: detailResult.rows[0].vehicle_name,
  };
}

module.exports = {
  getPracticalClasses,
  createPracticalClass,
};