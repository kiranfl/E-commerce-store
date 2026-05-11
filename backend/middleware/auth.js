const jwt = require("jsonwebtoken");

function parseToken(header) {
  if (!header || typeof header !== "string") return null;
  const trimmed = header.trim();
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
}

module.exports = (req, res, next) => {
  const token = parseToken(req.headers.authorization);
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};