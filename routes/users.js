var express = require("express");
const router = express.Router();
const jwtMiddle = require("../utilities/jwtMiddle");
const { userValidtions } = require("../validation/validationFuc");
const {
  getLogIn,
  getUsers,
  addUser,
  updateUserDetails,
} = require("../controller/users");

router.post("/logIn", getLogIn);
router.get("/token", jwtMiddle, async (req, res) => {
  res.json({ status: "ok", message: "user is logged in" });
});

router.get("/logOut", (req, res) => {
  res.clearCookie("token").send("userLogOut");
});
router
  .route("/")
  .get(jwtMiddle, getUsers)
  .post(userValidtions, addUser)
  .put(jwtMiddle, userValidtions, updateUserDetails);

module.exports = router;
