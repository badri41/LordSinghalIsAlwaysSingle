const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "aqi_db",
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  acquireTimeout: 10000,
  dateStrings: true,
});

async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    return await connection.query(sql, params);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  executeQuery,
  closePool,
};
