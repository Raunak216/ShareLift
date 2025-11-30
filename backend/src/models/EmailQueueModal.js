import mongoose from "mongoose";

const EmailQueueSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: true },
  emailType: {
    type: String,
    required: true,
    enum: ["GROUP_FORMED", "REGRET", "PARTIAL", "CONTACT"],
  },
  payload: {
    userName: String,
    journeyDirection: String,
    journeyDate: String,
    journeyTime: String,
    groupMembers: Array,
  },

  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SENT", "FAILED"],
    default: "PENDING",
    index: true,
  },

  attempts: { type: Number, default: 0 },
  errorMsg: { type: String },

  createdAt: { type: Date, default: Date.now },
});
EmailQueueSchema.index({ "payload.journeyDate": 1, "payload.journeyTime": 1 });

const EmailQueue = mongoose.model("EmailQueue", EmailQueueSchema);
export default EmailQueue;

export async function sendMailFromQueue(job) {
  const { emailType, recipientEmail, payload } = job;

  let html, subject;

  if (emailType === "GROUP_FORMED") {
    subject = "Your ShareLift Group is Confirmed";
    html = groupFormedTemplate(payload);
  } else if (emailType === "PARTIAL") {
    subject = "Partial Group Formed";
    html = partialTemplate(payload);
  } else if (emailType === "REGRET") {
    subject = "No Group Could Be Formed";
    html = regretTemplate(payload);
  }

  return transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: recipientEmail,
    subject,
    html,
  });
}
