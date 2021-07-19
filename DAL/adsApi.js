const queries = require("./queries/adsQueries");

const sqlQurayPromise = require("./DBconnection");
const { mergeBetweenTables } = require("./utilitiesApi");

async function checkAdDB(
  { cartype, manufactur, model, color, gear, codeArea },
  action
) {
  if (action === "POST") {
    const carModelExists = await sqlQurayPromise(
      queries.cehckIfCarExists(cartype, manufactur, model)
    );
    if (!carModelExists.length) {
      return { status: "faild", message: "אנא בחר פרטי רכב שקיימים במערכת" };
    }
  }

  const myQueries = `${queries.checkCodeAreaExists(codeArea)} 
    ${queries.checkColorExists(color)}
    ${gear ? queries.checkGearExists(gear) : ""}`;
  const [codeAreaExists, colorExists, gearExists] = await sqlQurayPromise(
    myQueries
  );

  if (
    !codeAreaExists.length ||
    !colorExists.length ||
    (gear && !gearExists.length)
  ) {
    return {
      status: "faild",
      message: "קידומת ,סוג גיר או הצבע שהכנסת אינם מופיעים ברשימה",
    };
  }

  return {
    status: "ok",
  };
}
async function addNewAd(
  userID,
  {
    cartype,
    manufactur,
    model,
    owners,
    year,
    km,
    color,
    gear,
    codeArea,
    phone,
    city,
    price,
    moreDetails,
  },
  images
) {
  const newAd = await sqlQurayPromise(
    queries.addNewAd(
      userID,
      cartype,
      manufactur,
      model,
      owners,
      year,
      km,
      color,
      gear,
      codeArea,
      phone,
      city,
      price,
      moreDetails
    )
  );

  if (images.length) {
    await sqlQurayPromise(queries.addAdImages(newAd.insertId, ...images));
  }
  return { status: "ok", adId: newAd.insertId };
}

async function updateAd(
  userID,
  adID,
  {
    owners,
    year,
    km,
    color,
    gear,
    codeArea,
    phone,
    city,
    price,
    moreDetails: description,
  },
  images
) {
  await sqlQurayPromise(
    queries.updateAd(
      userID,
      adID,
      owners,
      year,
      km,
      color,
      gear,
      codeArea,
      phone,
      city,
      price,
      description
    )
  );
  if (images.length) {
    await sqlQurayPromise(queries.removeImages(adID));
    await sqlQurayPromise(queries.addAdImages(adID, ...images));
  }
}

async function getAds(
  adID,
  userID,
  editData,
  categoriesID,
  orderBy,
  desc = false,
  startFrom,
  limit,
  models,
  manufacturers,
  userOnline,
  offset
) {
  const myQueries =
    editData === "true"
      ? `${queries["getAdEditDataQuery"](adID)}
      ${queries.getAdsImageQuery(adID)}`
      : `${queries["getAdsDataQuery"](
          adID,
          userID,
          categoriesID,
          orderBy,
          desc,
          startFrom,
          limit,
          models,
          manufacturers,
          offset
        )} 
        ${queries.getAdsImageQuery(adID)}`;
  const [adsData, adsImages] = await sqlQurayPromise(myQueries);
  console.log(
    queries["getAdsDataQuery"](
      adID,
      userID,
      categoriesID,
      orderBy,
      desc,
      startFrom,
      limit,
      models,
      manufacturers,
      offset
    )
  );
  mergeBetweenTables(adsData, adsImages, "images", "adid", "imageUrl");
  if (userOnline) {
    for (const ad of adsData) {
      ad.userAd = false;
      if (ad.userID === userOnline) {
        ad.userAd = true;
      }
    }
  } else if (userID) {
    for (const ad of adsData) {
      ad.userAd = true;
    }
  }

  return adsData;
}

const setFavoriteAd = async (adID, userID) => {
  await sqlQurayPromise(queries.setNewFavoriteAd(adID, userID));
  const likeAds = await sqlQurayPromise(queries.getIDsOfFavorites(userID));
  return likeAds;
};

const removeAd = async (adID, userID) => {
  return await sqlQurayPromise(queries.removeAd(adID, userID));
};

const removeAdFromFavorite = async (userID, adID) => {
  await sqlQurayPromise(queries.removeFromFavorite(adID, userID));
  const likeAds = await sqlQurayPromise(queries.getIDsOfFavorites(userID));

  return likeAds;
};

const addView = async (userID, adID) => {
  const myQueries = `${queries.getAdsDataQuery(adID)} ${queries.checkIfUserView(
    userID,
    adID
  )}`;

  const [adExists, userView] = await sqlQurayPromise(myQueries);
  console.log(adExists, userView);
  if (adExists.length && !userView.length) {
    await sqlQurayPromise(queries.addView(userID, adID));
  }
};

async function getFavoritesAds(userID) {
  const myQueries = `${queries.getIDsOfFavorites(userID)} ${
    userID
      ? `${queries.getFavoritesAds(userID)} ${queries.getAdsImageQuery()}`
      : ""
  }`;
  if (userID) {
    const [adIDs, adData, adImages] = await sqlQurayPromise(myQueries);
    mergeBetweenTables(adData, adImages, "images", "adid", "imageUrl");
    return [adIDs, adData];
  }
  const likeAdsByUserID = await sqlQurayPromise(myQueries);
  return likeAdsByUserID;
}

module.exports = {
  checkAdDB,
  addNewAd,
  getAds,
  setFavoriteAd,
  removeAd,
  removeAdFromFavorite,
  getFavoritesAds,
  updateAd,
  addView,
};
