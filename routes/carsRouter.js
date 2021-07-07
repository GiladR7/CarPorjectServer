const express = require("express");
const router = express.Router();

const {
  getGears,
  getColors,
  getModels,
  getManufacturers,
  getCategories,
  getPhoneAreaCodes,
} = require("../controller/cars");

router.get("/", getCategories);

router.get("/manufacturers", getManufacturers);

router.get("/models", getModels);

router.get("/colors", getColors);

router.get("/gears", getGears);
router.get("/codeArea", getPhoneAreaCodes);

module.exports = router;
