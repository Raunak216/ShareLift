// cron/emailWorker.js
import cron from "node-cron";
import EmailQueue from "../models/EmailQueueModal.js";
import EmailLog from "../models/EmailLog.js";
import { sendGroupFormedMail } from "../utils/sendMail.js";

const EMAIL_TYPE_MAP = {
  GROUP_FORMED: sendGroupFormedMail,
};

cron.schedule("*/50 * * * * *", async () => {
  console.log("Email Worker Running...");

  const todaysCount = await EmailLog.countDocuments({
    sentAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(),
    },
  });

  if (todaysCount >= 450) {
    console.log("Daily limit reached — queue paused.");
    return;
  }

  const email = await EmailQueue.findOne({ status: "PENDING" }).sort({
    createdAt: 1,
  });

  if (!email) {
    console.log("No pending emails.");
    return;
  }

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

    console.log("Email sent:", email.recipientEmail);
  } catch (err) {
    console.log("Email Failed:", email.recipientEmail, err.message);

    const nextAttempts = email.attempts + 1;

    if (nextAttempts >= 3) {
      await EmailQueue.updateOne(
        { _id: email._id },
        {
          $set: {
            status: "FAILED_PERMANENTLY",
            errorMsg: err.message,
          },
          $inc: { attempts: 1 },
        }
      );
      console.log("Email marked as permanently failed:", email.recipientEmail);
    } else {
      await EmailQueue.updateOne(
        { _id: email._id },
        {
          $set: {
            status: "PENDING",
            errorMsg: err.message,
          },
          $inc: { attempts: 1 },
        }
      );
      console.log("Email will retry:", email.recipientEmail);
    }
  }
});
