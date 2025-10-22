import { Router } from "express";
import { googleAuthHandler } from "../controllers/googleOAuthController.js";
import {
  getMyDetailsHandler,
  refreshAccessToken,
} from "../controllers/UserController.js";
import { protect } from "../utils/authMiddleware.js";
import { getGoogleOAuthUrl } from "../controllers/googleOAuthController.js";
import { contactMe } from "../controllers/UserController.js";

const router = Router();

router.route("/api/auth/google").get(getGoogleOAuthUrl);
router.route("/api/sessions/oauth/google").get(googleAuthHandler);
router.route("/api/users/me").get(getMyDetailsHandler);
router.route("/api/auth/refresh").post(refreshAccessToken);
router.route("/api/send-feedback").post(contactMe);

export default router;
