const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool(env.db);

pool.on("error", (err) => {
  console.error("Error inesperado en PostgreSQL:", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};