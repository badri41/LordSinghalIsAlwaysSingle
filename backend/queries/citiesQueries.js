const { executeQuery } = require("../db/connections");

const GET_ALL_CITIES_QUERY = `
  SELECT city_id, city_name, state, region
  FROM cities
  ORDER BY city_name;
`;

async function findAllCities() {
  return executeQuery(GET_ALL_CITIES_QUERY);
}

module.exports = {
  findAllCities,
};
