const jwt = require("jsonwebtoken");
const config = require("config");

const auth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    res.status(401).send("Access denied, no token provied");
    return;
  }

  try {
    const payload = jwt.verify(token, config.get("jwtKey"));
    req.user = payload;

    next();
  } catch (error) {
    res.status(400).send("Invalid token!");
    return;
  }
};

module.exports = auth;
