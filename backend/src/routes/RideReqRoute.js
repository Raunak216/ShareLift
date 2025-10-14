import { Router } from "express";
import { protect } from "../utils/authMiddleware.js";
import { requestRide } from "../controllers/RideReqController.js";
const router = Router();

router.route("/api/rides").post(protect, requestRide);
// router.route("/api/rides/my").get();

export default router;
