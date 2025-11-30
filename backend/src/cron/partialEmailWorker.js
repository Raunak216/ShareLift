import cron from "node-cron";
import { Group } from "../models/GroupModal.js";
import { User } from "../models/UserModal.js";
import EmailQueue from "../models/EmailQueueModal.js";

//  CRON JOB —  ERROR
cron.schedule("*/1 * * * *", async () => {
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
          for (const m of memberDetails) {
            await EmailQueue.create({
              recipientEmail: m.email,
              emailType: "PARTIAL",
              payload: {
                userName: m.name,
                journeyDirection: group.direction,
                journeyDate: group.journeyDate,
                journeyTime: group.journeyTime,
                groupMembers: memberDetails,
              },
            });
          }
          console.log("Queued PARTIAL emails");
        } else {
          for (const member of group.members) {
            const u = await User.findById(member.userId).select("name email");
            await EmailQueue.create({
              recipientEmail: u.email,
              emailType: "REGRET",
              payload: {
                userName: u.name,
                journeyDirection: group.direction,
                journeyDate: group.journeyDate,
                journeyTime: group.journeyTime,
              },
            });
            console.log("Queued REGRET email:", u.email);
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
