import cron from "node-cron";
import { Group } from "../models/GroupModal.js";
import { User } from "../models/UserModal.js";
import EmailQueue from "../models/EmailQueueModal.js";

cron.schedule("*/5 * * * *", async () => {
  const now = new Date();

  try {
    const groups = await Group.find({
      status: "forming",
      partialNotified: false,
    });

    for (const group of groups) {
      let expiryTime = null;

      /* ========= FLIGHT ========= */
      if (group.transport === "flight") {
        if (!group.journeyTime) continue;

        const d = new Date(group.journeyDate);
        const [hh, mm] = group.journeyTime.split(":").map(Number);

        const journeyDateTime = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          hh,
          mm,
          0
        );

        expiryTime = new Date(journeyDateTime.getTime() - 2 * 60 * 60 * 1000);
      }

      /*  TRAIN  */
      if (group.transport === "train") {
        const d = new Date(group.journeyDate);
        expiryTime = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          23,
          59,
          59
        );
      }

      if (!expiryTime || expiryTime > now) continue;

      /* ========= EMAIL ========= */
      if (group.members.length > 1) {
        const members = await Promise.all(
          group.members.map(async (m) => {
            const u = await User.findById(m.userId).select("name email phone");
            return {
              name: u.name,
              email: u.email,
              phone: u.phone,
            };
          })
        );

        for (const m of members) {
          await EmailQueue.create({
            recipientEmail: m.email,
            emailType: "PARTIAL",
            payload: {
              userName: m.name,
              journeyDirection: group.direction,
              journeyDate: group.journeyDate,
              journeyTime: group.journeyTime,
              groupMembers: members,
            },
          });
        }
      } else {
        // const member = group.members[0];
        // const u = await User.findById(member.userId).select("name email");
        // await EmailQueue.create({
        //   recipientEmail: u.email,
        //   emailType: "REGRET",
        //   payload: {
        //     userName: u.name,
        //     journeyDirection: group.direction,
        //     journeyDate: group.journeyDate,
        //   },
        // });
      }

      group.status = "expired/Partial";
      group.partialNotified = true;
      await group.save();
    }
  } catch (err) {
    console.error("PARTIAL CRON ERROR:", err);
  }
});
