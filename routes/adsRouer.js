const express = require("express");
const router = express.Router();
const {
  getAds,
  setNewFavoriteAd,
  getFavoritesAds,
  removeFromFavorite,
  addNewAd,
  deleteAd,
} = require("../controller/ads");
const upload = require("../utilities/multer");
const { adValidtions } = require("../validation/validationFuc");

router
  .route("/")
  .get(getAds)
  .post([upload.array("carImages"), adValidtions], addNewAd)
  .delete(deleteAd);
router
  .route("/favorites")
  .get(getFavoritesAds)
  .post(setNewFavoriteAd)
  .delete(removeFromFavorite);

module.exports = router;
