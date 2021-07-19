const api = require("../DAL/api");
const bcrypt = require("bcrypt");
require(`dotenv`).config();
const { cehckInputBeforeDB } = require("../validation/validationFuc");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res) => {
  try {
    const users = await api.getUsers(req.userID);
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

    if (user) {
      const token = jwt.sign({ userID: user.userID }, process.env.ACCESS_TOKEN);
      res.cookie("token", token, {
        maxAge: 9000000000,
      });

      const { userID, ...userData } = user;
      return res.json({ status: "success", data: [userData] });
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
    const { password, ...rest } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const dbRespone = await api.addUser({ hashPassword, ...rest });

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
    const dbRespone = await api.updateUserDetails(req.userID, req.body);

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
