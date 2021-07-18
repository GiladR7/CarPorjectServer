const api = require("../DAL/api");
const jwt = require(`jsonwebtoken`);
const getCategories = async (req, res) => {
  try {
    const carsCategories = await api.getCarCategories();
    res.json(carsCategories);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get car categories");
  }
};

const getManufacturers = async (req, res) => {
  try {
    const { categoryID } = req.query;
    const manufacturers = await api.getManufacturers(categoryID);
    if (manufacturers.length) {
      return res.json(manufacturers);
    }
    res.status(404).send("manufacturer not found");
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get manufacturers");
  }
};

const getModels = async (req, res) => {
  try {
    const { categoryID, manufacturerID } = req.query;
    const models = await api.getModels(categoryID, manufacturerID);
    if (models.length) {
      return res.json(models);
    }
    res.status(404).send("model not found");
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get models");
  }
};

const getColors = async (req, res) => {
  try {
    const colors = await api.getColors();
    res.json(colors);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get car colors");
  }
};

const getGears = async (req, res) => {
  try {
    const gears = await api.getGears();
    res.json(gears);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get car gears");
  }
};
const getPhoneAreaCodes = async (req, res) => {
  try {
    const phoneCodes = await api.getPhoneAreaCodes();
    res.json(phoneCodes);
  } catch (err) {
    console.log(err);
    res.status(404).send("got some error when try to get phone codes area ");
  }
};

module.exports = {
  getGears,
  getColors,
  getModels,
  getManufacturers,
  getCategories,
  getPhoneAreaCodes,
};
