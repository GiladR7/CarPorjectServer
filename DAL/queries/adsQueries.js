const queries = {
  getAdsDataQuery(
    adID,
    userID,
    categoriesID,
    orderBy,
    desc,
    startFrom,
    limit = false
  ) {
    return `select ads.adid , ads.userID ,  modelname , manufacturername , gearname , count(ad_views.adID) views
          , description , owners , carprice , year(modelyear) modelyear , km , phone , city , colorname,
          adDate, codeArea
          from ads
            left join gears
          on gears.GearID = ads.GearID
          join manufacturers
          on manufacturers.ManufacturerID = ads.ManufacturerID
          join models
          on models.ModelID = ads.ModelID
          join car_color
          on car_color.ColorID = ads.ColorID
          join phone_area_codes
          on phone_area_codes.codeID = ads.codeAreaID
          left join ad_views
          on ads.adID = ad_views.adID
          ${adID || userID || categoriesID || startFrom ? "where" : ""}
          ${adID ? `ads.adID = ${adID}` : ""} 
          ${adID && userID ? "and" : ""}
          ${userID ? `ads.userID = ${userID}` : ""}
          ${
            categoriesID
              ? `(ads.categoryID in(${Array.from(categoriesID).join(",")}))`
              : ""
          }
           ${startFrom ? `and ads.adID >= ${startFrom}` : ""}
           group by ads.adID
          ${orderBy ? `order by ${orderBy}` : ""}
          ${desc === "true" ? "desc" : ""}
          ${limit ? `limit ${limit}` : ""};`;
  },
  getIDsOfFavorites(userID) {
    return `select  userID, adID
          from users_favorites
          ${userID ? `where userID = ${userID}` : ""};`;
  },
  getFavoritesAds(userID) {
    return `select ads.adid , ads.userID ,  modelname , manufacturername , gearname ,count(ad_views.adID) views,
          description , owners , carprice , year(modelyear)modelyear , km , phone , city , colorname,
          adDate  , codeArea
          from ads
          left join gears
          on gears.GearID = ads.GearID
          join manufacturers
          on manufacturers.ManufacturerID = ads.ManufacturerID
          join models
          on models.ModelID = ads.ModelID
          join car_color
          on car_color.ColorID = ads.ColorID
          join phone_area_codes
          on phone_area_codes.codeID = ads.codeAreaID
          left join ad_views
          on ad_views.adID = ads.adID 
          where ads.adID in (  select users_favorites.adID from users_favorites where userID =${userID})
          group by ads.adID;`;
  },
  addNewAd(
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
  ) {
    return `insert into ads (userID , modelID , categoryID , 
            manufacturerID , gearID , description , owners , carPrice , modelYear, km , phone,
            city, colorID , codeAreaID)
            values(${userID} , ${model} , ${cartype}, ${manufactur} , 
              ${gear ? gear : null} ,
              ${
                moreDetails ? `"${moreDetails}"` : null
              } , ${owners} , ${price} , "${year}", ${km},
              "${phone}", "${city}" ,${color}, ${codeArea})`;
  },
  getAdsImageQuery(adID) {
    return `select adid , imageUrl 
          from images
          ${adID ? `where adID = ${adID}` : ""};`;
  },
  getAdsViews(adID) {
    return `select adID, count(adID) views
        from ad_views
        ${adID ? `where adID = ${adID}` : ""}
        group by adID;`;
  },
  getAdEditDataQuery(adID) {
    return `select adid , userID ,  categoryID,modelID , manufacturerID , gearID
          , description as moreDetails , owners , carprice , modelyear , km , phone , city , colorID,
          adDate , codeAreaID
          from ads
          where adID = ${adID};`;
  },
  cehckIfCarExists(categoryID, manufacturerID, modelID) {
    return `select * from models
          where categoryID = ${categoryID}
          and manufacturerID = ${manufacturerID}
          and modelID = ${modelID};`;
  },
  checkColorExists(colorID) {
    return `select * from 
                  car_color
                  where colorID = ${colorID};`;
  },
  checkGearExists(gearID) {
    return `select * from 
                  gears
                  where gearID = ${gearID};`;
  },
  checkCodeAreaExists(codeID) {
    return `select * from 
              phone_area_codes
              where codeID = ${codeID};`;
  },
  addAdImages(adID, ...images) {
    return `insert into images (adID , imageUrl)
          ${images[0] ? `values (${adID},"${images[0]}")` : ""}
          ${images[1] ? ` ,(${adID},"${images[1]}")` : ""}
          ${images[2] ? ` ,(${adID},"${images[2]}")` : ""}
          ${images[3] ? ` ,(${adID},"${images[3]}")` : ""}
          ${images[4] ? ` ,(${adID},"${images[4]}")` : ""};`;
  },
  setNewFavoriteAd(adID, userID) {
    return `insert into users_favorites(userID, adID)
      values(${userID},${adID})`;
  },
  removeFromFavorite(adID, userID) {
    return `delete
              from users_favorites
              where adID = ${adID} and userID = ${userID};`;
  },
  removeAd(adID, userID) {
    return `delete
              from ads
              where adID = ${adID}  and userID = ${userID}`;
  },
  updateAd(
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
  ) {
    return `update ads
            set owners = ${owners} , carPrice = ${price} ,modelYear = "${year}",
            km = ${km} ,phone = "${phone}" , city = "${city}", colorID = ${color},
            codeAreaID = ${codeArea}${gear ? `, gearID = ${gear}` : ""} ,
            ${
              description
                ? `description = "${description}" `
                : "description = null"
            }
            where userID = ${userID} and adID = ${adID};`;
  },
  removeImages(adID) {
    return `delete
            from images
            where adID = ${adID}`;
  },
};

module.exports = queries;
