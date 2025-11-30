import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema({
  emailType: String,
  recipientEmail: String,
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("EmailLog", EmailLogSchema);
