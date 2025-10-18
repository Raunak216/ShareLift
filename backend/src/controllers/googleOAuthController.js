import "dotenv/config";
import axios from "axios";
import qs from "qs";
import { jwtDecode } from "jwt-decode";
import { User } from "../models/UserModal.js";
import jwt from "jsonwebtoken";

export const getGoogleOAuthUrl = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    client_id: process.env.CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
  };
  const queryStr = new URLSearchParams(options).toString();
  const authUrl = `${rootUrl}?${queryStr}`;
  return res.redirect(authUrl);
};
/**
 * Exchange authorization code for Google tokens
 */
export const googleAuthToken = async (code) => {
  const url = "https://oauth2.googleapis.com/token";
  const postValues = {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET_ID,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

  const res = await axios.post(url, qs.stringify(postValues), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
};

/**
 * Handle OAuth callback from Google
 */
const googleAuthHandler = async (req, res, next) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Authorization code missing.");
  }

  try {
    // Step 1: Exchange code for tokens
    const tokenData = await googleAuthToken(code);
    const { id_token } = tokenData;
    const googleUser = jwtDecode(id_token);

    // Step 2: Extract user data
    const userData = {
      email: googleUser.email,
      name: googleUser.given_name,
      regNo: googleUser.family_name,
    };

    // Step 3: Restrict to VIT users if needed
    // if (googleUser.hd !== "vitstudent.ac.in") {
    //   return res.status(401).json({
    //     message: "Access denied. Only @vitstudent.ac.in accounts are supported.",
    //   });
    // }

    // Step 4: Create or update user in DB
    const updatedUser = await User.findOneAndUpdate(
      { email: googleUser.email },
      { $set: userData },
      { upsert: true, new: true }
    );

    // Step 5: Create JWT tokens
    const appToken = jwt.sign(
      { userId: updatedUser._id, email: updatedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: updatedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 6: Set cookies
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("app_session", appToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3600000, // 1 hour
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 604800000, // 7 days
    });

    // Step 7: Redirect user to frontend
    const FRONTEND_HOME_URL =
      process.env.FRONTEND_HOME_URL || "http://localhost:3000";

    return res.redirect(FRONTEND_HOME_URL);
  } catch (err) {
    // Pass all unhandled errors to the middleware
    next(err);
  }
};

export { googleAuthHandler };
