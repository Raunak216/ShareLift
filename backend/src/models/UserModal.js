import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  regNo: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  phone: { type: String, required: false },
  trustScore: { type: Number, default: 5 },
  date: { type: Date, default: Date.now, required: true },
});
const User = mongoose.model("User", userSchema);

export { User };
