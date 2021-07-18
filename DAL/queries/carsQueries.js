const queries = {
  getManufacturersByCategory(categoryID) {
    return `select distinct 
          models.manufacturerID, manufacturerName 
        from models
        join manufacturers
        on models.ManufacturerID = manufacturers.ManufacturerID
        ${categoryID ? `where CategoryID = ${categoryID}` : ""};`;
  },
  getAllManufacturers: `select * from manufacturers`,
  getCarColorsQuery: `select * from car_color`,

  getGearsQuery: `select * from gears`,
  getCategoriesQuery: `select * from categories`,
  getModelsQuery(categoryID, manufacturerID) {
    return `select modelID , modelName
          from models
          ${categoryID || manufacturerID ? "where" : ""} 
          ${categoryID ? `CategoryID = ${categoryID}` : " "}  
          ${categoryID && manufacturerID ? "and" : ""} 
          ${
            manufacturerID
              ? `ManufacturerID in(${Array.from(manufacturerID).join(",")})`
              : ""
          };`;
  },

  getAreaCodes: `select * from phone_area_codes`,
};

module.exports = queries;
