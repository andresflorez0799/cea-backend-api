const db = require("../config/db");

async function getTheoryClasses() {
  const result = await db.query(
    `SELECT id, class_date AS date, topic, class_time AS time
     FROM theory_classes
     ORDER BY class_date ASC, class_time ASC`
  );

  return result.rows;
}

module.exports = {
  getTheoryClasses,
};