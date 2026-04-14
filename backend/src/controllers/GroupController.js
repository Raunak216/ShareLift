import { Group } from "../models/GroupModal.js";
import { RideReq } from "../models/RideReqModal.js";
import { User } from "../models/UserModal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import EmailQueue from "../models/EmailQueueModal.js";

const directionMap = {
  vitToChennaiAir: "VIT-v → Chennai Airport",
  ChennaiAirtoVit: "Chennai Airport → VIT-v",
  vitToKatpadiRail: "VIT-v → Katpadi Railway",
  KatpadiRailToVit: "Katpadi Railway → VIT-v",
  BlrToVit: "Bengluru Airport → VIT-v",
};

const finalizeGroupIfFull = async (group) => {
  if (group.members.length !== group.totalSeats) return;

  try {
    group.status = "finalized";
    await group.save();

    const memberIds = group.members.map((m) => m.userId);
    await RideReq.updateMany(
      { userId: { $in: memberIds } },
      { $set: { status: "formed" } },
    );

    const journeyDirection = directionMap[group.direction] || group.direction;
    const journeyDate = new Date(group.journeyDate).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const groupMembers = await Promise.all(
      group.members.map(async (m) => {
        const u = await User.findById(m.userId).select("name email phone");
        return {
          name: u?.name || "Unknown",
          email: u?.email || "NotAvailable",
          phone: u?.phone || "0000000000",
        };
      }),
    );

    for (const member of groupMembers) {
      if (!member.email || member.email === "NotAvailable") continue;

      await EmailQueue.create({
        recipientEmail: member.email,
        emailType: "GROUP_FORMED",
        payload: {
          userName: member.name,
          journeyDirection,
          journeyDate,
          transport: group.transport,
          journeyTime:
            group.transport === "flight" ? group.journeyTime : undefined,
          trainNumber:
            group.transport === "train" ? group.trainNumber : undefined,
          groupMembers,
        },
      });
    }

    // console.log("Queued GROUP_FORMED emails for group");
  } catch (err) {
    console.error("Error finalizing group:", err);
  }
};

const makeGroup = async (newRequest) => {
  //train logic
  if (newRequest.transport === "train") {
    const allGroups = await Group.find({
      transport: "train",
      direction: newRequest.direction,
      journeyDate: newRequest.journeyDate,
      trainNumber: newRequest.trainNumber,
      status: "forming",
      totalSeats: newRequest.vehicleCapacity,
    });

    for (let group of allGroups) {
      group.members.push({
        userId: newRequest.userId,
        requestId: newRequest._id,
      });
      await group.save();
      await finalizeGroupIfFull(group);
      return group;
    }
    const newGroup = new Group({
      transport: "train",
      direction: newRequest.direction,
      journeyDate: newRequest.journeyDate,
      trainNumber: newRequest.trainNumber,
      totalSeats: newRequest.vehicleCapacity,
      status: "forming",
      members: [{ userId: newRequest.userId, requestId: newRequest._id }],
    });

    await newGroup.save();
    return newGroup;
  }
  //flight logic
  const allGroups = await Group.find({
    transport: "flight",
    direction: newRequest.direction,
    journeyDate: newRequest.journeyDate,
    status: "forming",
    totalSeats: newRequest.vehicleCapacity,
  });

  const isGoingFromVIT = newRequest.direction.toLowerCase().startsWith("vit");

  for (let group of allGroups) {
    const groupTime = new Date(
      `${group.journeyDate.toISOString().split("T")[0]} ${group.journeyTime}`,
    );
    const reqTime = new Date(
      `${newRequest.journeyDate.toISOString().split("T")[0]} ${
        newRequest.journeyTime
      }`,
    );

    const diffMins = (groupTime - reqTime) / (1000 * 60);

    if (isGoingFromVIT) {
      if (diffMins >= 0 && diffMins <= group.tolerance) {
        group.journeyTime = newRequest.journeyTime;
        group.tolerance -= diffMins;
      } else if (diffMins < 0 && Math.abs(diffMins) <= newRequest.tolerance) {
        group.tolerance = newRequest.tolerance - Math.abs(diffMins);
      } else continue;
    } else {
      if (diffMins <= 0 && Math.abs(diffMins) <= group.tolerance) {
        group.journeyTime = newRequest.journeyTime;
        group.tolerance -= Math.abs(diffMins);
      } else if (diffMins > 0 && diffMins <= newRequest.tolerance) {
        group.tolerance = newRequest.tolerance - diffMins;
      } else continue;
    }

    group.members.push({
      userId: newRequest.userId,
      requestId: newRequest._id,
    });

    await group.save();
    await finalizeGroupIfFull(group);
    return group;
  }

  const newGroup = new Group({
    transport: "flight",
    direction: newRequest.direction,
    journeyDate: newRequest.journeyDate,
    journeyTime: newRequest.journeyTime,
    tolerance: newRequest.tolerance,
    totalSeats: newRequest.vehicleCapacity,
    status: "forming",
    members: [{ userId: newRequest.userId, requestId: newRequest._id }],
  });

  await newGroup.save();
  return newGroup;
};

const getActiveGroup = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const activeGroup = await Group.findOne({
    "members.userId": userId,
    status: { $in: ["forming", "finalized"] },
  }).populate({ path: "members.userId", select: "name email phone" });

  if (activeGroup) {
    return res.status(200).json({ request: activeGroup });
  }

  res.status(200).json({ request: null });
});

export { makeGroup, getActiveGroup };
