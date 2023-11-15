import mongoose from "mongoose";

const Device = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    device: {
      type: String,
    },
    os: {
      type: String,
    },
    fcm: {
      type: String,
    },
    socket: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Device", Device);
