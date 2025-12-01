import cron from "node-cron";
import EmailQueue from "../models/EmailQueueModal.js";
import EmailLog from "../models/EmailLog.js";

import {
  sendGroupFormedMail,
  //   sendPartialMail,
  //   sendRegretMail,
} from "../utils/sendMail.js";

const EMAIL_TYPE_MAP = {
  GROUP_FORMED: sendGroupFormedMail,
  //   PARTIAL: sendPartialMail,
  //   REGRET: sendRegretMail,
};

// Runs every 30 seconds
cron.schedule("*/60 * * * * *", async () => {
  console.log("Email Worker Running...");

  const todaysCount = await EmailLog.countDocuments({
    sentAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(),
    },
  });

  if (todaysCount >= 450) {
    console.log(" Daily limit reached — queue paused.");
    return;
  }

  const pendingEmails = await EmailQueue.find({ status: "PENDING" }).limit(5);

  for (const email of pendingEmails) {
    try {
      await EmailQueue.updateOne(
        { _id: email._id },
        { $set: { status: "PROCESSING" } }
      );

      const handler = EMAIL_TYPE_MAP[email.emailType];
      if (!handler) throw new Error(`Unknown email type ${email.emailType}`);

      await handler({
        recipientEmail: email.recipientEmail,
        ...email.payload,
      });

      await EmailLog.create({
        emailType: email.emailType,
        recipientEmail: email.recipientEmail,
      });

      await EmailQueue.deleteOne({ _id: email._id });

      console.log(" Email sent:", email.recipientEmail);
    } catch (err) {
      await EmailQueue.updateOne(
        { _id: email._id },
        {
          $set: {
            status: "FAILED",
            errorMsg: err.message,
          },
          $inc: { attempts: 1 },
        }
      );

      console.log(" Email Failed:", email.recipientEmail);
    }
  }
});
