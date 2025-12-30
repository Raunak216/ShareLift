import httpStatus from "http-status";
import { RideReq } from "../models/RideReqModal.js";
import { makeGroup } from "./GroupController.js";
import { User } from "../models/UserModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Group } from "../models/GroupModal.js";

const requestRide = asyncHandler(async (req, res, next) => {
  const {
    direction,
    journeyDate,
    journeyTime,
    vehicleCapacity,
    tolerance,
    phone,
    transport,
    trainNumber,
  } = req.body;

  if (!direction || !journeyDate || !phone || !transport) {
    const error = new Error(
      "Missing required fields: direction, journeyDate, phone, transport"
    );
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  if (transport === "flight") {
    if (!journeyTime || tolerance === undefined) {
      const error = new Error(
        "Missing required flight fields: journeyTime, tolerance"
      );
      error.statusCode = httpStatus.BAD_REQUEST;
      throw error;
    }
  }

  if (transport === "train") {
    if (!trainNumber) {
      const error = new Error("Missing required train fields: trainNumber");
      error.statusCode = httpStatus.BAD_REQUEST;
      throw error;
    }
  }

  const parsedDate = new Date(journeyDate);
  if (isNaN(parsedDate.getTime())) {
    const error = new Error("Invalid journeyDate format");
    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  const parsedCapacity = Number(vehicleCapacity);
  const finalCapacity = Number.isFinite(parsedCapacity) ? parsedCapacity : 3;

  const parsedTolerance = Number(tolerance);
  const finalTolerance =
    transport === "flight" && Number.isFinite(parsedTolerance)
      ? parsedTolerance
      : 0;
  const parsedPhone = String(phone);

  const userId = req.userId;
  if (!userId) {
    const error = new Error("Not authenticated");
    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }
  const now = new Date();
  const activeReq = await RideReq.findOne({
    userId,
    journeyDate: { $gte: now },
    status: { $in: ["pending", "formed"] },
  });
  if (activeReq) {
    const error = new Error("You already have an active request");
    error.statusCode = httpStatus.CONFLICT;
    error.data = { requestId: activeReq._id };
    throw error;
  }

  await User.findByIdAndUpdate(userId, { $set: { phone: parsedPhone } });

  const newRequest = new RideReq({
    userId,
    direction,
    transport,
    journeyDate: parsedDate,
    journeyTime: transport === "flight" ? journeyTime : undefined,
    trainNumber: transport === "train" ? trainNumber : undefined,
    vehicleCapacity: finalCapacity,
    tolerance: transport === "flight" ? finalTolerance : 0,
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

const deleteRequest = asyncHandler(async (req, res) => {
  const groupId = req.params.id;
  const userId = req.userId;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (group.status === "finalized") {
    return res.status(400).json({
      message:
        "This group is already finalized. Please use the Contact Us section on the home page to request a cancellation.",
    });
  }

  const memberIndex = group.members.findIndex(
    (m) => m.userId.toString() === userId
  );

  if (memberIndex === -1) {
    return res.status(400).json({ message: "User not in group" });
  }

  const leavingMember = group.members[memberIndex];
  group.members.splice(memberIndex, 1);

  /* Group empty  */
  if (group.members.length === 0) {
    await Group.deleteOne({ _id: groupId });

    await RideReq.findByIdAndUpdate(leavingMember.requestId, {
      status: "cancelled",
    });

    return res.json({
      message: "Group deleted and request cancelled",
    });
  }

  // One member left
  if (group.members.length === 1 && group.transport === "flight") {
    const remainingReq = await RideReq.findById(group.members[0].requestId);

    // Reset tolerance
    group.tolerance = remainingReq.tolerance;
    group.journeyTime = remainingReq.journeyTime;
  }

  await group.save();

  await RideReq.findByIdAndUpdate(leavingMember.requestId, {
    status: "cancelled",
  });

  return res.json({
    message: "Left group successfully",
    remainingMembers: group.members.length,
  });
});

export { requestRide, deleteRequest };
