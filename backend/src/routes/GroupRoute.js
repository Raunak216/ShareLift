import { Router } from "express";
import { getActiveGroup } from "../controllers/GroupController.js";
import { protect } from "../utils/authMiddleware.js";
const router = Router();

// router.route("/api/groups/match").post(protect);
router.route("/api/groups/my").get(protect, getActiveGroup);

// router.route("/api/notify/email").post();
// router.route("/api/notify/whatsapp").post();
export default router;
