import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.app_session;
    if (!token) {
      return res.status(401).json({ message: "No authentication token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again." });
    }
    next(err); // Pass to global error handler for logging
  }
};
