const adInputs = {
  owners: {
    value: "",
    errors: [],
    isValid: true,
  },
  year: {
    value: "",
    errors: [],
    isValid: true,
  },
  km: {
    value: "",
    errors: [],
    isValid: true,
  },
  color: {
    value: "",
    errors: [],
    isValid: true,
  },
  gear: {
    value: "",
    errors: [],
    isValid: true,
  },
  codeArea: {
    value: "",
    errors: [],
    isValid: true,
  },
  phone: {
    value: "",
    errors: [],
    isValid: true,
  },
  city: {
    value: "",
    errors: [],
    isValid: true,
  },
  price: {
    value: "",
    errors: [],
    isValid: true,
  },
  moreDetails: {
    value: "",
    errors: [],
    isValid: true,
  },
};

const userInputs = {
  user: { value: "", isValid: true, errors: [] },
  email: { value: "", isValid: true, errors: [] },
  password: { value: "", isValid: true, errors: [] },
  confirmPassword: { value: "", isValid: true, errors: [] },
  chooseCategories: { value: [], isValid: true, errors: [] },
};

module.exports = {
  adInputs,
  userInputs,
};
