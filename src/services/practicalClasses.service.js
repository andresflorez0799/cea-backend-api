const db = require("../config/db");

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getPracticalClasses(userId) {
  const result = await db.query(
    `SELECT pc.id,
            pc.class_date AS date,
            pc.class_time AS time,
            i.full_name AS instructor_name,
            v.name AS vehicle_name,
            pc.status,
            60::int AS duration_minutes
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
    durationMinutes: row.duration_minutes,
    classLabel: "Clase práctica",
  }));
}

async function createPracticalClass(userId, payload) {
  const { date, time, instructorId, vehicleId } = payload;

  if (!date || !time || !instructorId || !vehicleId) {
    throw createHttpError("Fecha, hora, instructor y vehículo son obligatorios.");
  }

  const paramsResult = await db.query("SELECT max_practical_hours FROM system_parameters LIMIT 1");
  const takenResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM practical_classes
     WHERE user_id = $1 AND status IN ('Activa', 'Completada')`,
    [userId]
  );

  const maxHours = Number(paramsResult.rows[0]?.max_practical_hours || 20);
  const takenHours = Number(takenResult.rows[0]?.total || 0);

  if (takenHours >= maxHours) {
    throw createHttpError("Has alcanzado el número máximo de horas prácticas permitidas.");
  }

  const instructorResult = await db.query(
    `SELECT id, full_name
     FROM instructors
     WHERE id = $1 AND is_active = true`,
    [instructorId]
  );

  if (instructorResult.rowCount === 0) {
    throw createHttpError("El instructor seleccionado no está disponible.");
  }

  const vehicleResult = await db.query(
    `SELECT id, name
     FROM vehicles
     WHERE id = $1 AND is_active = true`,
    [vehicleId]
  );

  if (vehicleResult.rowCount === 0) {
    throw createHttpError("El vehículo seleccionado no está disponible.");
  }

  const instructorBusyResult = await db.query(
    `SELECT id
     FROM practical_classes
     WHERE class_date = $1
       AND class_time = $2
       AND status = 'Activa'
       AND instructor_id = $3
     LIMIT 1`,
    [date, time, instructorId]
  );

  if (instructorBusyResult.rowCount > 0) {
    throw createHttpError("El instructor ya esta asignado.", 409);
  }

  const vehicleBusyResult = await db.query(
    `SELECT id
     FROM practical_classes
     WHERE class_date = $1
       AND class_time = $2
       AND status = 'Activa'
       AND vehicle_id = $3
     LIMIT 1`,
    [date, time, vehicleId]
  );

  if (vehicleBusyResult.rowCount > 0) {
    throw createHttpError("El vehículo ya esta asignado.", 409);
  }

  const result = await db.query(
    `INSERT INTO practical_classes (user_id, instructor_id, vehicle_id, class_date, class_time, status)
     VALUES ($1, $2, $3, $4, $5, 'Activa')
     RETURNING id, class_date AS date, class_time AS time, status`,
    [userId, instructorId, vehicleId, date, time]
  );

  return {
    id: result.rows[0].id,
    date: result.rows[0].date,
    time: result.rows[0].time,
    status: result.rows[0].status,
    instructorName: instructorResult.rows[0].full_name,
    vehicleName: vehicleResult.rows[0].name,
    durationMinutes: 60,
    classLabel: "Clase práctica",
  };
}

module.exports = {
  getPracticalClasses,
  createPracticalClass,
};
