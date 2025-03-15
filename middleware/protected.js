const jwt = require("jsonwebtoken");

const protected = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT error:", error); // Log the specific error for debugging purposes
    return res.status(401).json({
      message: "Unauthorized, invalid or expired token.",
      error: error.message, // Include error message for clarity (if appropriate)
    });
  }
};
module.exports = protected;
