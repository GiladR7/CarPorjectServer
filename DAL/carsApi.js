const queries = require("./queries/carsQueries");

const sqlQurayPromise = require("./DBconnection");

async function getManufacturers(categoryID) {
  if (categoryID) {
    return sqlQurayPromise(queries.getManufacturersByCategory(categoryID));
  }
  return sqlQurayPromise(queries.getAllManufacturers);
}

async function getModels(categoryID, manufacturerID) {
  return sqlQurayPromise(queries.getModelsQuery(categoryID, manufacturerID));
}

async function getColors() {
  return sqlQurayPromise(queries.getCarColorsQuery);
}

async function getGears() {
  return sqlQurayPromise(queries.getGearsQuery);
}

async function getCarCategories() {
  return sqlQurayPromise(queries.getCategoriesQuery);
}
async function getPhoneAreaCodes() {
  return sqlQurayPromise(queries.getAreaCodes);
}

module.exports = {
  getPhoneAreaCodes,
  getCarCategories,
  getGears,
  getColors,
  getModels,
  getManufacturers,
};
