import mongoose from "mongoose";
const { Schema } = mongoose;
const GroupSchema = new Schema({
  direction: { type: String, required: true },
  journeyDate: { type: Date, required: true },
  journeyTime: {
    type: String,
    required: function () {
      return this.transport === "flight";
    },
  },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      requestId: { type: Schema.Types.ObjectId, ref: "RideReq" },
      confirmed: { type: Boolean, default: false },
    },
  ],
  tolerance: { type: Number, default: 60 },
  transport: { type: String, enum: ["flight", "train"], required: true },
  trainNumber: {
    type: String,
    required: function () {
      return this.transport === "train";
    },
  },
  totalSeats: { type: Number, required: true },
  status: {
    type: String,
    enum: ["forming", "finalized", "cancelled", "expired/Partial"],
    default: "forming",
  },
  partialNotified: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", GroupSchema);

export { Group };
