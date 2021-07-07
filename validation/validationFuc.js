const { validation } = require("./validationObj");

function validationFunc(inputsValues, { name, value }, carType) {
  console.log(name);
  const errors = [];
  if (carType === 3 && name === "gear") return;
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

module.exports = {
  validationFunc,
  cehckInputBeforeDB,
};
