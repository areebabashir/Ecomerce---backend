import mongoose from "mongoose";

export default mongoose.model("users", new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
));

