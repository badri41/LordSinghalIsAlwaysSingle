const { executeQuery } = require("../db/connections");

async function getHealth(req, res, next) {
  try {
    await executeQuery("SELECT 1 AS ok;");
    res.json({
      status: "ok",
      service: "aqi-backend",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHealth,
};
