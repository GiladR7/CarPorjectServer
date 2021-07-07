const validation = {
  user: {
    required: true,
    requiredError: "שדה המשתמש הוא שדה חובה",
    regex: /[A-Za-z0-9א-ת]{3,}/,
    regexError: " שדה המשתמש צריך להכיל לפחות 3 תווים",
  },
  email: {
    required: true,
    requiredError: "שדה האיימיל הוא שדה חובה",
    regex: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    regexError: "הכנס איימיל תקין",
  },
  password: {
    required: true,
    requiredError: "שדה הסיסמא הוא שדה חובה",
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    regexError: "שדה סיסמא מכיל לפחות 8 תווים,  ספרה אחת ואות אחת באנגלית בלבד",
  },
  confirmPassword: {
    required: true,
    requiredError: "שדה אימות סיסמא הוא שדה חובה",
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    regexError: "שדה סיסמא מכיל לפחות 8 תווים, ספרה אחת ואות אחת באנגלית בלבד",
    funcValidation(password, confirmPassword) {
      return password !== confirmPassword;
    },
    customError: "סיסמא לא תואמת",
  },

  year: {
    required: true,
    requiredError: "שנת הרכב הוא שדה חובה",
    funcValidation(year) {
      const d = new Date();
      year = year.split("-")[0];
      return 1950 > year || year > d.getFullYear();
    },
    customError: `ניתן לעלות רכב בין השנים ${new Date().getFullYear()} - ${1950}`,
  },
  color: {
    required: true,
    requiredError: "צבע הרכב הוא שדה חובה",
  },
  gear: {
    required: true,
    requiredError: "בחר את סוג תיבת ההילוכים",
  },
  codeArea: {
    required: true,
    requiredError: "בחר קידומת",
  },
  phone: {
    required: true,
    requiredError: "הכנס טלפון",
    regex: /^\d{7}$/,
    regexError: "מספר טלפון צריך להכיל 7 ספורת ",
  },
  file: {
    required: false,
    funcValidation(value) {
      return value.length > 5;
    },
    customError: "ניתן לעלות מקסימום 5 תמונות",
  },
  city: {
    required: true,
    requiredError: "בחר עיר מהרשימה",
  },
  moreDetails: {
    required: false,
  },
  price: {
    required: true,
    funcValidation(price) {
      return price < 0 || price > 10000000;
    },
    requiredError: "מחיר הרכב הוא שדה חובה",
    customError: "המחיר המקסימלי הוא 10,000,000",
  },
  km: {
    required: true,
    funcValidation(km) {
      return km < 0 || km > 500000;
    },
    requiredError: "מספר הקילומטרים הוא שדה חובה",
    customError: "הקילומטרז המקסימלי הוא 500,000",
  },
  chooseCategory: {
    require: false,
  },
  owners: {
    required: true,
    funcValidation(owners) {
      return owners < 0 || owners > 10;
    },
    requiredError: "יד הרכב הוא שדה חובה",
    customError: "מספר הבעלים המקסימלי הוא 10",
  },
  cartype: {
    required: true,
    funcValidation(id) {
      return !(typeof Number(id) === "number") || Number.isNaN(Number(id));
    },
  },
  manufactur: {
    required: true,
    funcValidation(id) {
      return !(typeof Number(id) === "number") || Number.isNaN(Number(id));
    },
  },
  model: {
    required: true,
    funcValidation(id) {
      return !(typeof Number(id) === "number") || Number.isNaN(Number(id));
    },
  },
};

module.exports = {
  validation,
};
