const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config");

const authMiddleWare = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader || !authheader.startsWith("Bearer")) {
    return res.status(403).json({});
  }

  const token = authheader.split(" ")[1];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    if (decode.userId) {
      req.userId = decode.userId;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch {
    return res.status(403).json({});
  }
};

module.exports = {
  authMiddleWare,
};
