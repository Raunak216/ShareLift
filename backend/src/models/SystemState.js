import mongoose from "mongoose";

const systemStateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("SystemState", systemStateSchema);
