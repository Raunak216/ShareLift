import cron from "node-cron";
import EmailQueue from "../models/EmailQueueModal.js";
import EmailLog from "../models/EmailLog.js";
import SystemState from "../models/SystemState.js";

import {
  sendGroupFormedMail,
  sendPartialMail,
  // sendRegretMail,
} from "../utils/sendMail.js";

const EMAIL_TYPE_MAP = {
  GROUP_FORMED: sendGroupFormedMail,
  PARTIAL: sendPartialMail,
  // REGRET: sendRegretMail
};

const getQuotaStatus = async () => {
  const s = await SystemState.findOne({ key: "gmail_quota_exceeded" });
  return s?.value || false;
};

const setQuotaStatus = async (v) => {
  await SystemState.findOneAndUpdate(
    { key: "gmail_quota_exceeded" },
    { value: v, updatedAt: new Date() },
    { upsert: true },
  );
};

cron.schedule("*/50 * * * * *", async () => {
  if (await getQuotaStatus()) return;

  const email = await EmailQueue.findOneAndUpdate(
    { status: "PENDING", attempts: { $lt: 3 } },
    { status: "PROCESSING" },
    { sort: { createdAt: 1 }, new: true },
  );

  if (!email) return;

  try {
    const handler = EMAIL_TYPE_MAP[email.emailType];

    if (!handler) {
      // console.error("No handler for email type:", email.emailType);
      await EmailQueue.updateOne(
        { _id: email._id },
        { status: "FAILED_PERMANENTLY", errorMsg: "No handler found" },
      );
      return;
    }
    await handler({ recipientEmail: email.recipientEmail, ...email.payload });

    await EmailLog.create({
      emailType: email.emailType,
      recipientEmail: email.recipientEmail,
      sentAt: new Date(),
    });

    await EmailQueue.deleteOne({ _id: email._id });
  } catch (err) {
    const msg = err.message || "";
    const quota = /quota|4\.7\.0|5\.4\.5/i.test(msg);

    if (quota) {
      await setQuotaStatus(true);
      await EmailQueue.updateOne({ _id: email._id }, { status: "PENDING" });
      return;
    }

    await EmailQueue.updateOne(
      { _id: email._id },
      {
        $inc: { attempts: 1 },
        status: email.attempts >= 2 ? "FAILED_PERMANENTLY" : "PENDING",
        errorMsg: msg,
      },
    );
  }
});
