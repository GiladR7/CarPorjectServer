const api = require("../DAL/api");
const { cehckInputBeforeDB } = require("../validation/validationFuc");
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
    const { part1, part2, userID } = req.body;
    const checkPart2 = cehckInputBeforeDB(part2, part1.cartype.value);
    const checkPart1 = cehckInputBeforeDB(part1);
    if (!checkPart2) {
      return res.json({ status: "falid", part2Validtion: part2 });
    }
    if (!checkPart1) {
      return res.json({
        status: "falid",
        message: "מלא את השלב הראשון בצורה תקינה",
      });
    }

    const responeDB = await api.addNewAd(userID, {
      ...checkPart1,
      ...checkPart2,
    });
    res.json(responeDB);
  } catch (err) {
    console.log(err);
    res.json({
      status: "faild",
      message: "קיימת שגיאת מערכת נסה שנית מאוחר יותר",
    });
  }
};

module.exports = {
  getAds,
  getFavoritesAds,
  setNewFavoriteAd,
  removeFromFavorite,
  addNewAd,
};
