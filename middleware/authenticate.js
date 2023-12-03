//karl
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function authenticate(req, res, next) {
  const token = req.header("x-auth-token");
  console.log("Received Token:", token);

  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded Token:", decoded);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = authenticate;
