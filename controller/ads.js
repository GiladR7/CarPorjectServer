const api = require("../DAL/api");

const getAds = async (req, res) => {
  try {
    const {
      adID,
      editData,
      userID,
      categoryID: categoriesID,
      orderBy,
      desc,
      startFrom,
      limit,
    } = req.query;

    const ads = await api.getAds(
      adID,
      userID,
      editData,
      categoriesID,
      orderBy,
      desc,
      startFrom,
      limit
    );

    if (ads.length) {
      return res.json({ status: "ok", data: ads });
    }
    res.status(404).json({ status: "faild", message: "ad not exists" });
  } catch (err) {
    console.log(err);
    res.status(404).send("got some error when try to get ads");
  }
};

const getFavoritesAds = async (req, res) => {
  try {
    const { userID } = req.query;
    const ads = await api.getFavoritesAds(userID);
    if (ads.length) {
      return res.json(ads);
    }
    res.status(404).send("favoritesAds for this id not exists");
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get favorites ads");
  }
};

const setNewFavoriteAd = async (req, res) => {
  try {
    const { userID, adID } = req.body;
    const responeDB = await api.setFavoriteAd(adID, userID);
    res.json(responeDB);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try set new favoriteAd");
  }
};

const removeFromFavorite = async (req, res) => {
  try {
    const { userID, adID } = req.body;
    const responeDB = await api.removeAdFromFavorite(userID, adID);
    res.json(responeDB);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try remove ad form favorite");
  }
};

const addNewAd = async (req, res) => {
  try {
    const { userID, ...adData } = req.body;
    const respone = await api.addNewAd(userID, adData, req.images);
    res.json(respone);
  } catch (err) {
    console.error(err);
    res.json({
      status: "faild",
      message: "קיימת שגיאת מערכת נסה שנית מאוחר יותר",
    });
  }
};

const deleteAd = async (req, res) => {
  try {
    const { adID, userID } = req.body;
    console.log(adID, userID);
    await api.removeAd(adID, userID);
    res.json({ status: "ok", message: "ad deleted" });
  } catch (err) {
    console.log(err);
    res.json({
      status: "faild",
      message: "got some error when try to delete ad",
    });
  }
};

module.exports = {
  getAds,
  getFavoritesAds,
  setNewFavoriteAd,
  removeFromFavorite,
  addNewAd,
  deleteAd,
};
