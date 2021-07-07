const express = require("express");
const router = express.Router();
const {
  getAds,
  setNewFavoriteAd,
  getFavoritesAds,
  removeFromFavorite,
  addNewAd,
} = require("../controller/ads");

router.route("/").get(getAds).post(addNewAd);

router
  .route("/favorites")
  .get(getFavoritesAds)
  .post(setNewFavoriteAd)
  .delete(removeFromFavorite);

module.exports = router;
