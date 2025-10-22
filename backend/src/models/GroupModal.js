import mongoose from "mongoose";
const { Schema } = mongoose;
const GroupSchema = new Schema({
  direction: { type: String, required: true },
  journeyDate: { type: Date, required: true },
  journeyTime: { type: String, required: true },
  members: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      requestId: { type: Schema.Types.ObjectId, ref: "RideReq" },
      confirmed: { type: Boolean, default: false },
    },
  ],
  tolerance: { type: Number, default: 60 },
  totalSeats: { type: Number, required: true },
  status: {
    type: String,
    enum: ["forming", "finalized", "cancelled", "expired/Partial"],
    default: "forming",
  },
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", GroupSchema);

export { Group };
