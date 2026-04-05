const { executeQuery } = require("../db/connections");

const GET_DAILY_BY_CITY_RANGE_QUERY = `
  SELECT date, aqi_daily AS avgAqi, pm25 AS avgPm25, pm10 AS avgPm10
  FROM aqi_data
  WHERE city_id = ?
    AND date BETWEEN ? AND ?
  ORDER BY date ASC;
`;

const GET_OVERVIEW_QUERY = `
  SELECT
    c.city_id,
    c.city_name,
    c.state,
    latest.date AS latestDate,
    latest.aqi_daily AS currentAqi,
    latest.pm25 AS currentPm25,
    latest.pm10 AS currentPm10,
    month_stats.avgAqi AS monthAvgAqi,
    month_stats.avgPm25 AS monthAvgPm25,
    month_stats.avgPm10 AS monthAvgPm10
  FROM cities c
  LEFT JOIN (
    SELECT d.city_id, d.date, d.aqi_daily, d.pm25, d.pm10
    FROM aqi_data d
    INNER JOIN (
      SELECT city_id, MAX(date) AS max_date
      FROM aqi_data
      GROUP BY city_id
    ) m
      ON m.city_id = d.city_id
     AND m.max_date = d.date
  ) latest
    ON latest.city_id = c.city_id
  LEFT JOIN (
    SELECT
      d.city_id,
      AVG(d.aqi_daily) AS avgAqi,
      AVG(d.pm25) AS avgPm25,
      AVG(d.pm10) AS avgPm10
    FROM aqi_data d
    INNER JOIN (
      SELECT city_id, YEAR(MAX(date)) AS latest_year, MONTH(MAX(date)) AS latest_month
      FROM aqi_data
      GROUP BY city_id
    ) lm
      ON lm.city_id = d.city_id
     AND YEAR(d.date) = lm.latest_year
     AND MONTH(d.date) = lm.latest_month
    GROUP BY d.city_id
  ) month_stats
    ON month_stats.city_id = c.city_id
  ORDER BY c.city_name;
`;

const GET_HISTORICAL_BY_CITY_MONTH_QUERY = `
  SELECT
    YEAR(date) AS year,
    ROUND(AVG(aqi_daily), 0) AS avgAqi,
    ROUND(AVG(pm25), 0) AS avgPm25,
    ROUND(AVG(pm10), 0) AS avgPm10
  FROM aqi_data
  WHERE city_id = ?
    AND MONTH(date) = ?
  GROUP BY YEAR(date)
  ORDER BY YEAR(date);
`;

async function findDailyByCityAndRange(cityId, startDate, endDate) {
  return executeQuery(GET_DAILY_BY_CITY_RANGE_QUERY, [cityId, startDate, endDate]);
}

async function findOverviewStats() {
  return executeQuery(GET_OVERVIEW_QUERY);
}

async function findHistoricalByCityMonth(cityId, month) {
  return executeQuery(GET_HISTORICAL_BY_CITY_MONTH_QUERY, [cityId, month]);
}

module.exports = {
  findDailyByCityAndRange,
  findOverviewStats,
  findHistoricalByCityMonth,
};
