const {
  logIn,
  getUsers,
  updateUserDetails,
  checkUserDB,
  addUser,
} = require("./usersApi");
const {
  checkAdDB,
  addNewAd,
  getAds,
  setFavoriteAd,
  removeAd,
  removeAdFromFavorite,
  getFavoritesAds,
  updateAd,
  addView,
} = require("./adsApi");
const {
  getPhoneAreaCodes,
  getCarCategories,
  getGears,
  getColors,
  getModels,
  getManufacturers,
} = require("./carsApi");

const api = {
  getManufacturers,
  getModels,
  getColors,
  getGears,
  getCarCategories,
  getAds,
  logIn,
  getUsers,
  getFavoritesAds,
  getPhoneAreaCodes,
  addUser,
  setFavoriteAd,
  removeAdFromFavorite,
  updateUserDetails,
  addNewAd,
  checkAdDB,
  removeAd,
  checkUserDB,
  updateAd,
  addView,
};
module.exports = api;
