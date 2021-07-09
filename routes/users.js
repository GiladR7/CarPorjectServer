var express = require("express");
const router = express.Router();
const { addUserValidtions } = require("../validation/validationFuc");
const {
  getLogIn,
  getUsers,
  addUser,
  updateUserDetails,
} = require("../controller/users");

router.post("/logIn", getLogIn);

router
  .route("/")
  .get(getUsers)
  .post(addUserValidtions, addUser)
  .put(updateUserDetails);

module.exports = router;
