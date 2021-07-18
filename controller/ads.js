const api = require("../DAL/api");

const getAds = async (req, res) => {
  try {
    const {
      adID,
      editData,
      userID,
      categoryID: categoriesID,
      orderBy,
      modelID: models,
      manufacturerID: manufacturers,
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
      limit,
      models,
      manufacturers,
      req.userID
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

async function getMyAds(req, res) {
  try {
    const ads = await api.getAds(undefined, req.userID);
    if (ads.length) {
      return res.json({ status: "ok", data: ads });
    }
    res.status(404).json({ status: "faild", message: "ad not exists" });
  } catch (err) {
    console.log(err);
    res.status(404).send("got some error when try to get ads");
  }
}

const getFavoritesAds = async (req, res) => {
  try {
    const ads = await api.getFavoritesAds(req.userID);

    if (ads.length) {
      return res.json({ status: "ok", ads });
    }
    res.status(404).send("favoritesAds for this id not exists");
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try to get favorites ads");
  }
};

const setNewFavoriteAd = async (req, res) => {
  try {
    const { adID } = req.body;
    const responeDB = await api.setFavoriteAd(adID, req.userID);
    res.json(responeDB);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try set new favoriteAd");
  }
};

const removeFromFavorite = async (req, res) => {
  try {
    const { adID } = req.body;
    const responeDB = await api.removeAdFromFavorite(req.userID, adID);
    res.json(responeDB);
  } catch (err) {
    console.log(err);
    res.status(404).send("get some error when try remove ad form favorite");
  }
};

const addNewAd = async (req, res) => {
  try {
    const { ...adData } = req.body;

    const respone = await api.addNewAd(req.userID, adData, req.images);
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
    const { adID } = req.body;

    await api.removeAd(adID, req.userID);
    res.json({ status: "ok", message: "ad deleted" });
  } catch (err) {
    console.log(err);
    res.json({
      status: "faild",
      message: "got some error when try to delete ad",
    });
  }
};

const updateAd = async (req, res) => {
  try {
    const { adID, ...adData } = req.body;

    await api.updateAd(req.userID, adID, adData, req.images);

    res.json({ status: "ok", message: "ad update" });
  } catch (err) {
    console.error(err);
    res.json({
      status: "faild",
      message: "קיימת שגיאת מערכת בעדכון פרטי המודעה",
    });
  }
};

const addView = async (req, res) => {
  try {
    const { adID } = req.body;

    await api.addView(req.userID, adID);

    res.json({ status: "ok", message: "ad update View" });
  } catch (err) {
    console.error(err);
    res.json({
      status: "faild",
      message: "got some error when try to ad view",
    });
  }
};

const canEditAd = async (req, res) => {
  try {
    const { adID } = req.query;
    const ad = await api.getAds(adID, req.userID);

    if (ad.length) {
      return res.json({ status: "ok", data: ad });
    }
    res.status(404).json({ status: "faild", message: "ad not exists" });
  } catch (err) {
    console.error(err);
    res.json({
      status: "faild",
      message: "got some error when val",
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
  updateAd,
  addView,
  getMyAds,
  canEditAd,
};
