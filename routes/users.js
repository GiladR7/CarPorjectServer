var express = require("express");
const router = express.Router();
const {
  getLogIn,
  getUsers,
  addUser,
  updateUserDetails,
} = require("../controller/users");

router.post("/logIn", getLogIn);

router.route("/").get(getUsers).post(addUser).put(updateUserDetails);

module.exports = router;
