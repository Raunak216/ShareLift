import { User } from "../models/UserModal.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMyDetailsHandler = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select("name email");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error; // automatically caught by asyncHandler → next(error)
  }

  res.json({ user });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const user = await User.findById(userId).select("email name");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const newAppToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("app_session", newAppToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3600000, // 1 hour
  });

  res.json({
    message: "Token refreshed successfully",
    user: user.toObject({ getters: true }),
  });
});

export { getMyDetailsHandler, refreshAccessToken };
