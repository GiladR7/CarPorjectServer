const { validation } = require("./validationObj");
const { adInputs, userInputs } = require("../validation/inputsObj");
const api = require("../DAL/api");
const { cartype, manufactur, model, ...updateAdInputs } = { ...adInputs };
const { password, confirmPassword, ...userUpdateInputs } = { ...userInputs };
function validationFunc(inputsValues, { name, value }, carType) {
  const errors = [];

  if (Number(carType) === 3 && name === "gear") return;
  let isValid = true;
  if (validation[name].required && !value) {
    errors.push(validation[name].requiredError);
    isValid = false;
  }
  if (validation[name].regex && !validation[name].regex.test(value)) {
    errors.push(validation[name].regexError);
    isValid = false;
  }

  if (
    validation[name].funcValidation &&
    validation[name].funcValidation(value, inputsValues?.password?.value)
  ) {
    isValid = false;
    errors.push(validation[name].customError);
  }
  if (name === "file") {
    value = value.files;
  }

  inputsValues[name].isValid = isValid;
  inputsValues[name].errors = errors;
  inputsValues[name].value = value;
}

function cehckInputBeforeDB(inputValues, carType) {
  for (const input in inputValues) {
    validationFunc(
      inputValues,
      {
        name: input,
        value: inputValues[input].value,
      },
      carType
    );
  }
  const dbInputs = {};
  for (const input in inputValues) {
    if (inputValues[input].errors.length !== 0) {
      return false;
    }
    dbInputs[input] = inputValues[input].value;
  }
  return dbInputs;
}

function validationMiddle(expectedInput) {
  return (req, res) => {
    const { chooseCategory, ...inputAd } = req.body;

    for (const key in expectedInput) {
      expectedInput[key].value = inputAd[key];
    }

    const objectData = cehckInputBeforeDB(expectedInput, chooseCategory);

    if (!objectData) {
      return { status: "faild", inputsValue: expectedInput };
    }
    return { status: "ok" };
  };
}

async function adValidtions(req, res, next) {
  try {
    const expectedInput = req.method === "POST" ? adInputs : updateAdInputs;

    const checkInputs = validationMiddle(expectedInput);
    const respone = checkInputs(req, res);

    if (respone.status !== "ok") {
      return res.json(respone);
    }

    const responeDB = await api.checkAdDB(req.body, req.method);

    if (responeDB.status !== "ok") {
      return res.status(400).json(responeDB);
    }

    req.images = [];

    for (const file of req.files) {
      req.images.push(file.filename);
    }

    next();
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ status: "faild", message: "שגיאה נסה שנית מאוחר יותר" });
  }
}

async function userValidtions(req, res, next) {
  const expectedInput = req.method === "POST" ? userInputs : userUpdateInputs;

  const checkInputs = validationMiddle(expectedInput);
  const respone = checkInputs(req, res);
  if (respone.status !== "ok") {
    return res.json(respone);
  }

  if (req.method === "POST") {
    const responeDB = await api.checkUserDB(req.body.email);

    if (responeDB.status !== "ok") {
      return res.status(400).json(responeDB);
    }
  }

  next();
}

module.exports = {
  validationFunc,
  cehckInputBeforeDB,
  adValidtions,
  userValidtions,
};
