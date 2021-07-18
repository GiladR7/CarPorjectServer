const jwt = require(`jsonwebtoken`);

function isLoggedIn(req, res, next) {
  const { token } = req.cookies;

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      const { userID } = decoded;
      req.userID = userID;
    }
    next();
  });
}

module.exports = isLoggedIn;
