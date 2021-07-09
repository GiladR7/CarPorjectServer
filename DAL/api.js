const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  multipleStatements: true,
  password: "8214778Gad",
  database: "cars-data",
});

const queries = {
  selectUsers: `select * from users`,
  getUserCategories(userID) {
    return `select * 
    from users_categories
    where userid = ${userID}; `;
  },
  logInQuery(email, password) {
    return `select  userID , userName as user ,  email 
    from users 
    where email ="${email}" and userPassword = "${password}";`;
  },
  getUseByID(userID) {
    return `select  userID , userName as user ,  email 
    from users 
    where userID ="${userID}}";`;
  },
  getManufacturersQuery(categoryID) {
    return `select distinct 
    models.manufacturerID, manufacturerName 
  from models
  join manufacturers
  on models.ManufacturerID = manufacturers.ManufacturerID
  ${categoryID ? `where CategoryID = ${categoryID}` : ""};`;
  },
  getCarColorsQuery: `select * from car_color`,
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
  getGearsQuery: `select * from gears`,
  getCategoriesQuery: `select * from categories`,
  getModelsQuery(categoryID, manufacturerID) {
    return `select modelID , modelName
    from models
    ${categoryID || manufacturerID ? "where" : ""} 
    ${categoryID ? `CategoryID = ${categoryID}` : " "}  
    ${categoryID && manufacturerID ? "and" : ""} 
    ${manufacturerID ? `ManufacturerID = ${manufacturerID}` : ""};`;
  },
  cehckIfCarExists(categoryID, manufacturerID, modelID) {
    return `select * from models
    where categoryID = ${categoryID}
    and manufacturerID = ${manufacturerID}
    and modelID = ${modelID};`;
  },
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
    return `select adid , userID ,  modelID , manufacturerID , gearID
    , description , owners , carprice , modelyear , km , phone , city , colorID,
    adDate , codeAreaID
    from ads
    where adID = ${adID};`;
  },
  addAdImages(adID, ...images) {
    return `insert into images (adID , imageUrl)
    ${images[0] ? `values (${adID},"${images[0]}")` : ""}
    ${images[1] ? ` ,(${adID},"${images[1]}")` : ""}
    ${images[2] ? ` ,(${adID},"${images[2]}")` : ""}
    ${images[3] ? ` ,(${adID},"${images[3]}")` : ""}
    ${images[4] ? ` ,(${adID},"${images[4]}")` : ""};`;
  },
  getAreaCodes: `select * from phone_area_codes`,
  checkCodeAreaExists(codeID) {
    return `select * from 
            phone_area_codes
            where codeID = ${codeID};`;
  },
  emailExists(email, userID) {
    return `select *
    from users
    where  email = "${email}" ${userID ? `and userID != ${userID}` : ""};`;
  },
  updateUserNameAndEmail(userID, user, email) {
    return `update users
            set username = "${user}", email = "${email}"
            where userID = ${userID}`;
  },
  addNewUser(user, email, password) {
    return `insert into users (username , email , userPassword )
    values("${user}","${email}","${password}");`;
  },
  removeUserCategories(userID) {
    return `delete from users_categories
            where userID = ${userID}`;
  },
  addUserCategories(userID, ...categories) {
    return `insert into users_categories (userID , categoryID)
    ${categories[0] ? `values(${userID},${categories[0]})` : ""}
    ${categories[1] ? `,(${userID},${categories[1]})` : ""}
    ${categories[2] ? `,(${userID},${categories[2]})` : ""}`;
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
};
const sqlQurayPromise = (query) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
        connection.release();
      });
    });
  });
};

async function getManufacturers(categoryID) {
  return sqlQurayPromise(queries.getManufacturersQuery(categoryID));
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

async function checkAdDB({
  cartype,
  manufactur,
  model,
  color,
  gear,
  codeArea,
}) {
  const carModelExists = await sqlQurayPromise(
    queries.cehckIfCarExists(cartype, manufactur, model)
  );
  if (!carModelExists.length) {
    return { status: "faild", message: "אנא בחר פרטי רכב שקיימים במערכת" };
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

async function getAds(
  adID,
  userID,
  editData,
  categoriesID,
  orderBy,
  desc = false,
  startFrom,
  limit
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
          limit
        )} 
      ${queries.getAdsImageQuery(adID)}`;
  const [adsData, adsImages] = await sqlQurayPromise(myQueries);
  mergeBetweenTables(adsData, adsImages, "images", "adid", "imageUrl");
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

function mergeBetweenTables(
  table,
  mergeWith,
  propertyName,
  mergeID,
  mergeData
) {
  const mergeMap = new Map();

  for (const { [mergeID]: id, [mergeData]: data } of mergeWith) {
    mergeMap.has(id) ? mergeMap.get(id).push(data) : mergeMap.set(id, [data]);
  }
  for (const row of table) {
    row[propertyName] = [];
    if (mergeMap.has(row[mergeID])) {
      row[propertyName] = [...mergeMap.get(row[mergeID])];
    }
  }
}

async function logIn(email, password) {
  const user = await sqlQurayPromise(queries.logInQuery(email, password));
  if (user.length) {
    const userCategories = await getUserCategories(user[0].userID);
    mergeBetweenTables(
      user,
      userCategories,
      "chooseCategory",
      "userID",
      "categoryID"
    );
  }

  return user;
}

async function getUsers() {
  return sqlQurayPromise(queries.selectUsers);
}

async function getUserCategories(userID) {
  return sqlQurayPromise(queries.getUserCategories(userID));
}

async function getPhoneAreaCodes() {
  return sqlQurayPromise(queries.getAreaCodes);
}

async function updateUserDetails(userID, { user, email, chooseCategory }) {
  const emailUnique = await sqlQurayPromise(queries.emailExists(email, userID));
  if (emailUnique.length !== 0) {
    return {
      status: "faild",
      message: "איימל קיים זה קיים במערכת",
    };
  }

  await sqlQurayPromise(queries.removeUserCategories(userID));

  if (chooseCategory.length) {
    await sqlQurayPromise(queries.addUserCategories(userID, ...chooseCategory));
  }

  await sqlQurayPromise(queries.updateUserNameAndEmail(userID, user, email));
  const updateUser = await sqlQurayPromise(queries.getUseByID(userID));
  const userCategories = await getUserCategories(userID);

  mergeBetweenTables(
    updateUser,
    userCategories,
    "chooseCategory",
    "userID",
    "categoryID"
  );
  return {
    status: "ok",
    data: updateUser,
  };
}

async function checkUserDB(email) {
  const emailUnique = await sqlQurayPromise(queries.emailExists(email));
  if (emailUnique.length !== 0) {
    return {
      status: "faild",
      message: "ההרשמה נכשלה ,איימיל קיים כבר במערכת",
    };
  }
  return { status: "ok" };
}

async function addUser({ user, email, password, chooseCategory }) {
  const newUser = await sqlQurayPromise(
    queries.addNewUser(user, email, password)
  );

  await sqlQurayPromise(
    queries.addUserCategories(newUser.insertId, ...chooseCategory)
  );

  return {
    status: "ok",
    newUser,
  };
}

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
};
module.exports = api;
