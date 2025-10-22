import { User } from "../models/UserModal.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContactMeMail } from "../utils/AmazonSesMailer.js";

const getMyDetailsHandler = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select("name email");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ user });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    const error = new Error("Refresh token missing , Please logIn");
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
    maxAge: 3600000,
  });

  res.json({
    message: "Token refreshed successfully",
    user: user.toObject({ getters: true }),
  });
});

const contactMe = asyncHandler(async (req, res, next) => {
  const { recipientEmail, userName, message } = req.body;
  if (!userName || !recipientEmail || !message) {
    const error = new Error("Missing feilds");
    error.statusCode = 400;
    throw error;
  }

  await ContactMeMail({ recipientEmail, userName, message });
  res.status(200).json({ message: "Feedback sent successfully!" });
});

export { getMyDetailsHandler, refreshAccessToken, contactMe };
