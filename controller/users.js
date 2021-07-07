const api = require("../DAL/api");
const { cehckInputBeforeDB } = require("../validation/validationFuc");
const getUsers = async (req, res) => {
  try {
    const users = await api.getUsers();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(404)(`get some error when try to get users`);
  }
};

const getLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await api.logIn(email, password);
    if (user.length) {
      return res.json({ status: "success", data: user });
    }
    res
      .status(404)
      .json({ status: "faild", message: "איימל או סיסמא אינם נכונים" });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "faild",
      message: "קיימת בעיה במערכת נסה שוב מאוחר יותר",
    });
  }
};

const addUser = async (req, res) => {
  try {
    const inputValues = req.body;
    const submitValues = cehckInputBeforeDB(inputValues);

    if (!submitValues) {
      return res.status(400).json({ status: "faild", inputValues });
    }

    const dbRespone = await api.addUser(submitValues);

    if (dbRespone.status === "ok") {
      return res.json(dbRespone);
    } else {
      return res.status(400).json(dbRespone);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "faild",
      message: "קיימת שגיאת מערכת בהוספת משתמש חדש נסה שנית מאוחר יותר",
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const [{ userID }, inputValues] = req.body;
    const submitValues = cehckInputBeforeDB(inputValues);

    if (!submitValues) {
      res.status(400).json({ status: "faild", inputValues });
    }

    const dbRespone = await api.updateUserDetails(userID, submitValues);

    if (dbRespone.status === "ok") {
      return res.json(dbRespone);
    } else {
      return res.status(400).json(dbRespone);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "faild",
      message: "קיימת שגיאת מערכת בעדכון פרטים נסה שנית מאוחר יותר",
    });
  }
};
module.exports = {
  getLogIn,
  getUsers,
  addUser,
  updateUserDetails,
};
