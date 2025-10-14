// controllers/RideReqController.js
import httpStatus from "http-status";
import { RideReq } from "../models/RideReqModal.js";
import { makeGroup } from "./GroupController.js";
import { User } from "../models/UserModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const requestRide = asyncHandler(async (req, res, next) => {
  const {
    direction,
    journeyDate,
    journeyTime,
    vehicleCapacity,
    tolerance,
    phone,
  } = req.body;

  if (!direction || !journeyDate || !journeyTime || !phone) {
    const error = new Error(
      "Missing required fields: direction, journeyDate, journeyTime, phone"
    );
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const parsedTolerance = Number(tolerance);
  const parsedCapacity = Number(vehicleCapacity);
  const parsedPhone = String(phone);

  const finalTolerance = Number.isFinite(parsedTolerance)
    ? parsedTolerance
    : 60;
  const finalCapacity = Number.isFinite(parsedCapacity) ? parsedCapacity : 3;

  const parsedDate = new Date(journeyDate);
  if (isNaN(parsedDate.getTime())) {
    const error = new Error("Invalid journeyDate format");
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const userId = req.userId;
  if (!userId) {
    const error = new Error("Not authenticated");
    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }

  const activeReq = await RideReq.findOne({ userId, status: "pending" });
  if (activeReq) {
    const error = new Error("You already have an active ride request");
    error.statusCode = httpStatus.CONFLICT;
    error.data = { requestId: activeReq._id };
    throw error;
  }

  await User.findByIdAndUpdate(userId, { $set: { phone: parsedPhone } });

  const newRequest = new RideReq({
    userId,
    direction,
    journeyDate: parsedDate,
    journeyTime,
    vehicleCapacity: finalCapacity,
    tolerance: finalTolerance,
    status: "pending",
    createdAt: Date.now(),
  });

  await newRequest.save();

  const group = await makeGroup(newRequest);

  res.status(httpStatus.CREATED).json({
    message: "Ride request successfully submitted",
    request: newRequest,
    group,
  });
});

export { requestRide };
