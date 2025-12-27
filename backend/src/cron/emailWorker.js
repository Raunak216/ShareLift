import cron from "node-cron";
import EmailQueue from "../models/EmailQueueModal.js";
import EmailLog from "../models/EmailLog.js";
import SystemState from "../models/SystemState.js";
import { sendGroupFormedMail } from "../utils/sendMail.js";

const EMAIL_TYPE_MAP = { GROUP_FORMED: sendGroupFormedMail };

const getQuotaStatus = async () => {
  const state = await SystemState.findOne({ key: "gmail_quota_exceeded" });
  return state ? state.value : false;
};

const setQuotaStatus = async (status) => {
  await SystemState.findOneAndUpdate(
    { key: "gmail_quota_exceeded" },
    { value: status, updatedAt: new Date() },
    { upsert: true }
  );
};

cron.schedule("0 0 * * *", async () => {
  await setQuotaStatus(false);
  console.log("Database: Daily quota flag reset.");
});

cron.schedule("*/51 * * * * *", async () => {
  const isPaused = await getQuotaStatus();
  if (isPaused) return;

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaysCount = await EmailLog.countDocuments({
      sentAt: { $gte: startOfDay },
    });

    if (todaysCount >= 432) {
      console.log("Daily limit reached.");
      await setQuotaStatus(true);
      return;
    }

    const email = await EmailQueue.findOneAndUpdate(
      { status: "PENDING", attempts: { $lt: 3 } },
      { $set: { status: "PROCESSING" } },
      { sort: { createdAt: 1 }, new: true }
    );

    if (!email) return;

    try {
      const handler = EMAIL_TYPE_MAP[email.emailType];
      await handler({ recipientEmail: email.recipientEmail, ...email.payload });

      await EmailLog.create({
        emailType: email.emailType,
        recipientEmail: email.recipientEmail,
        sentAt: new Date(),
      });
      await EmailQueue.deleteOne({ _id: email._id });
    } catch (err) {
      const msg = err.message || "";
      const isQuotaError = /quota|Daily sending|4\.7\.0|5\.4\.5/i.test(msg);

      if (isQuotaError) {
        await setQuotaStatus(true);
        await EmailQueue.updateOne(
          { _id: email._id },
          { $set: { status: "PENDING" } }
        );
        return;
      }

      const nextAttempts = (email.attempts || 0) + 1;
      await EmailQueue.updateOne(
        { _id: email._id },
        {
          $set: {
            status: nextAttempts >= 3 ? "FAILED_PERMANENTLY" : "PENDING",
            errorMsg: msg,
          },
          $inc: { attempts: 1 },
        }
      );
    }
  } catch (globalErr) {
    console.error("Worker Error:", globalErr);
  }
});
