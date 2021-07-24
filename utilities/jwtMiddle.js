const jwt = require(`jsonwebtoken`);

function jwtMiddle(req, res, next) {
  const { token } = req.cookies;

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ status: "failed", message: "unvalid token" });
    } else {
      const { userID } = decoded;

      req.userID = userID;
      next();
    }
  });
}

module.exports = jwtMiddle;
