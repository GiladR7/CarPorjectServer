const express = require("express");
const router = express.Router();
const {
  getAds,
  setNewFavoriteAd,
  getFavoritesAds,
  removeFromFavorite,
  addNewAd,
  deleteAd,
  updateAd,
  addView,
  getMyAds,
  canEditAd,
} = require("../controller/ads");
const jwtMiddle = require("../utilities/jwtMiddle");
const upload = require("../utilities/multer");
const { adValidtions } = require("../validation/validationFuc");
const isLoggedIn = require("../utilities/isLogeedIn");
router
  .route("/")
  .get(isLoggedIn, getAds)
  .post([jwtMiddle, upload.array("carImages"), adValidtions], addNewAd)
  .delete(jwtMiddle, deleteAd)
  .put([jwtMiddle, upload.array("carImages"), adValidtions], updateAd);
router
  .route("/favorites")
  .get(jwtMiddle, getFavoritesAds)
  .post(jwtMiddle, setNewFavoriteAd)
  .delete(jwtMiddle, removeFromFavorite);

router.get("/can-edit", jwtMiddle, canEditAd);

router.get("/myAds", jwtMiddle, getMyAds);

router.route("/views").post(jwtMiddle, addView);

module.exports = router;
