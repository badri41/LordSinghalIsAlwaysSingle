const express = require("express");

const {
  getDailyAqi,
  getOverviewAqi,
  getHistoricalAqi,
} = require("../controllers/aqiController");

const router = express.Router();

router.get("/daily", getDailyAqi);
router.get("/overview", getOverviewAqi);
router.get("/historical", getHistoricalAqi);

module.exports = router;
