const jwt = require("jsonwebtoken");

exports.identifier = async (req, res, next) => {
  const token =
    req.headers.authorization ||
    req.headers["Authorization"] ||
    req.cookie["Authorization"];

  if (!token) {
    return res.status(403).json({
      status: "Failed",
      message: "You are not logged in! Please log in to get access.",
    });
  }

  try {
    const userToken = token.split(" ")[1];
    const jwtVerified = jwt.verify(userToken, process.env.JWT_SECRET);

    if (!jwtVerified) {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid token",
      });
    }
    req.user = jwtVerified;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
};
