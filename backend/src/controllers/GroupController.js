// controllers/GroupController.js
import { Group } from "../models/GroupModal.js";
import { RideReq } from "../models/RideReqModal.js";
import { User } from "../models/UserModal.js";
import cron from "node-cron";
import { sendGroupFormedMail } from "../utils/AmazonSesMailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const directionMap = {
  vitToChennaiAir: "VIT-v → Chennai Airport",
  ChennaiAirtoVit: "Chennai Airport → VIT-v",
  vitToKatpadiRail: "VIT-v → Katpadi Railway",
  KatpadiRailToVit: "Katpadi Railway → VIT-v",
};

const finalizeGroupIfFull = async (group) => {
  if (group.members.length !== group.totalSeats) return;

  try {
    group.status = "finalized";
    await group.save();

    const memberIds = group.members.map((m) => m.userId);
    await RideReq.updateMany(
      { userId: { $in: memberIds } },
      { $set: { status: "formed" } }
    );

    const journeyDirection = directionMap[group.direction] || group.direction;
    const journeyDate = new Date(group.journeyDate).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const journeyTime = group.journeyTime || "Not specified";

    const groupMembers = await Promise.all(
      group.members.map(async (m) => {
        const u = await User.findById(m.userId).select("name email phone");
        return {
          name: u?.name || "Unknown",
          email: u?.email || "Not Available",
          phone: u?.phone || "Not Available",
        };
      })
    );

    for (const member of groupMembers) {
      if (member.email && member.email !== "Not Available") {
        await sendGroupFormedMail({
          recipientEmail: member.email,
          userName: member.name,
          journeyDirection,
          journeyDate,
          journeyTime,
          groupMembers,
        });
      }
    }

    console.log("✅ Group finalized and members notified");
  } catch (err) {
    console.error("❌ Error finalizing group:", err);
  }
};

const makeGroup = async (newRequest) => {
  const allGroups = await Group.find({
    direction: newRequest.direction,
    journeyDate: newRequest.journeyDate,
    status: "forming",
  });

  for (let group of allGroups) {
    const groupTime = new Date(
      `${group.journeyDate.toISOString().split("T")[0]} ${group.journeyTime}`
    );
    const reqTime = new Date(
      `${newRequest.journeyDate.toISOString().split("T")[0]} ${
        newRequest.journeyTime
      }`
    );
    const diffMins = (groupTime - reqTime) / (1000 * 60);

    if (diffMins >= 0 && diffMins <= group.tolerance) {
      group.journeyTime = newRequest.journeyTime;
      group.tolerance = group.tolerance - diffMins;
      group.members.push({
        userId: newRequest.userId,
        requestId: newRequest._id,
      });
      await group.save();
      await finalizeGroupIfFull(group);
      return group;
    } else if (diffMins < 0 && Math.abs(diffMins) <= newRequest.tolerance) {
      group.tolerance = newRequest.tolerance - Math.abs(diffMins);
      group.members.push({
        userId: newRequest.userId,
        requestId: newRequest._id,
      });
      await group.save();
      await finalizeGroupIfFull(group);
      return group;
    }
  }

  const newGroup = new Group({
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

//  CRON JOB —
cron.schedule("*/30 * * * *", async () => {
  const now = new Date();

  try {
    const formingGroups = await Group.find({ status: "forming" });

    for (let group of formingGroups) {
      const createdAt = new Date(group.createdAt);
      const groupTime = new Date(
        `${group.journeyDate.toISOString().split("T")[0]} ${group.journeyTime}`
      );

      const totalTimeGap = groupTime.getTime() - createdAt.getTime();

      const eightyPercentTime = new Date(
        createdAt.getTime() + 0.8 * totalTimeGap
      );

      const twoHoursBeforeJourney = new Date(
        groupTime.getTime() - 2 * 60 * 60 * 1000
      );

      const expiryTime =
        eightyPercentTime < twoHoursBeforeJourney
          ? eightyPercentTime
          : twoHoursBeforeJourney;

      if (expiryTime <= now) {
        if (group.members.length > 1) {
          const memberDetails = await Promise.all(
            group.members.map(async (m) => {
              const u = await User.findById(m.userId).select(
                "name email phone"
              );
              return { name: u.name, email: u.email, phone: u.phone };
            })
          );
          await sendPartialGroupFormed(memberDetails, group);
        } else {
          for (const member of group.members) {
            const u = await User.findById(member.userId).select("name email");
            await sendRegretMail({
              recipientEmail: u.email,
              userName: u.name,
              journeyDirection: group.direction,
              journeyDate: group.journeyDate,
              journeyTime: group.journeyTime,
            });
          }
        }

        group.status = "expired/Partial";
        await group.save();
      }
    }
  } catch (err) {
    console.error("Error running partial group cron:", err);
  }
});

export { makeGroup, getActiveGroup };
