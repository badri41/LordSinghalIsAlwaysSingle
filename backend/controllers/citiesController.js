const { findAllCities } = require("../queries/citiesQueries");

function mapCity(row) {
  return {
    id: Number(row.city_id),
    name: row.city_name,
    state: row.state,
    region: row.region,
  };
}

async function getCities(req, res, next) {
  try {
    const rows = await findAllCities();
    res.json(rows.map(mapCity));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCities,
};
