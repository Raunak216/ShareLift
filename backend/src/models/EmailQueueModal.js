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
    transport: {
      type: String,
      enum: ["train", "flight"],
    },
    journeyTime: String,
    trainNumber: String,

    groupMembers: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
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

EmailQueueSchema.index({
  "payload.journeyDate": 1,
  "payload.journeyTime": 1,
});

const EmailQueue = mongoose.model("EmailQueue", EmailQueueSchema);
export default EmailQueue;
