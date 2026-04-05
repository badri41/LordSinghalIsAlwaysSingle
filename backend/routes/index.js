const express = require("express");

const aqiRoutes = require("./aqiRoutes");
const citiesRoutes = require("./citiesRoutes");
const healthRoutes = require("./healthRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/cities", citiesRoutes);
router.use("/aqi", aqiRoutes);

module.exports = router;
