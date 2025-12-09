import { Router } from "express";
import { protect } from "../utils/authMiddleware.js";
import {
  requestRide,
  deleteRequest,
} from "../controllers/RideReqController.js";
const router = Router();

router.route("/api/rides").post(protect, requestRide);
// router.route("/api/rides/my").get();
router.route("/api/rides/:id").delete(protect, deleteRequest);
export default router;
