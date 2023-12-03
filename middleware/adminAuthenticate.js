//karl
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function adminAuthenticate(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded.is_admin) {
      return res.status(403).json({ msg: "Not authorized to access this resource" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = adminAuthenticate;
