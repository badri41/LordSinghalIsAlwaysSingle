const {
  findDailyByCityAndRange,
  findHistoricalByCityMonth,
  findOverviewStats,
} = require("../queries/aqiQueries");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parsePositiveInt(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function isValidDateString(value) {
  if (!DATE_REGEX.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function toMetricNumber(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  return Math.round(numeric);
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function mapDailyRecord(row) {
  const avgAqi = toMetricNumber(row.avgAqi);
  const avgPm25 = toMetricNumber(row.avgPm25);
  const avgPm10 = toMetricNumber(row.avgPm10);

  return {
    date: normalizeDate(row.date),
    daily: {
      avgAqi,
      avgPm25,
      avgPm10,
      maxAqi: avgAqi,
      minAqi: avgAqi,
      maxPm25: avgPm25,
      minPm25: avgPm25,
      maxPm10: avgPm10,
      minPm10: avgPm10,
    },
  };
}

function mapOverviewRecord(row) {
  return {
    id: Number(row.city_id),
    name: row.city_name,
    state: row.state,
    currentAqi: toMetricNumber(row.currentAqi),
    currentPm25: toMetricNumber(row.currentPm25),
    currentPm10: toMetricNumber(row.currentPm10),
    monthAvg: {
      aqi: toMetricNumber(row.monthAvgAqi),
      pm25: toMetricNumber(row.monthAvgPm25),
      pm10: toMetricNumber(row.monthAvgPm10),
    },
  };
}

function mapHistoricalRecord(row) {
  return {
    year: Number(row.year),
    avgAqi: toMetricNumber(row.avgAqi),
    avgPm25: toMetricNumber(row.avgPm25),
    avgPm10: toMetricNumber(row.avgPm10),
  };
}

async function getDailyAqi(req, res, next) {
  const cityId = parsePositiveInt(req.query.cityId);
  const { startDate, endDate } = req.query;

  if (!cityId) {
    return res.status(400).json({ error: "cityId must be a positive integer." });
  }

  if (!startDate || !isValidDateString(startDate)) {
    return res.status(400).json({ error: "startDate must be in YYYY-MM-DD format." });
  }

  if (!endDate || !isValidDateString(endDate)) {
    return res.status(400).json({ error: "endDate must be in YYYY-MM-DD format." });
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: "startDate cannot be after endDate." });
  }

  try {
    const rows = await findDailyByCityAndRange(cityId, startDate, endDate);
    return res.json(rows.map(mapDailyRecord));
  } catch (error) {
    return next(error);
  }
}

async function getOverviewAqi(req, res, next) {
  try {
    const rows = await findOverviewStats();
    return res.json(rows.map(mapOverviewRecord));
  } catch (error) {
    return next(error);
  }
}

async function getHistoricalAqi(req, res, next) {
  const cityId = parsePositiveInt(req.query.cityId);
  let month = Number.parseInt(req.query.month, 10);

  if (!cityId) {
    return res.status(400).json({ error: "cityId must be a positive integer." });
  }

  if (Number.isInteger(month) && month >= 0 && month <= 11) {
    month += 1;
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "month must be in range 1-12 (or 0-11 index)." });
  }

  try {
    const rows = await findHistoricalByCityMonth(cityId, month);
    return res.json(rows.map(mapHistoricalRecord));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDailyAqi,
  getOverviewAqi,
  getHistoricalAqi,
};
