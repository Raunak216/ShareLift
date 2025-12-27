import mongoose from "mongoose";
const { Schema } = mongoose;

const RideReqSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  direction: { type: String, required: true },
  journeyDate: { type: Date, required: true },
  journeyTime: {
    type: String,
    required: function () {
      return this.transport === "flight";
    },
  },
  transport: { type: String, enum: ["flight", "train"], required: true },
  trainNumber: {
    type: String,
    required: function () {
      return this.transport === "train";
    },
  },
  vehicleCapacity: { type: Number, default: 2 },
  tolerance: { type: Number, default: 60 },
  status: {
    type: String,
    enum: ["pending", "formed", "cancelled"],
    default: "pending",
  },
  date: { type: Date, default: Date.now, required: true },
});
const RideReq = mongoose.model("RideReq", RideReqSchema);

export { RideReq };
