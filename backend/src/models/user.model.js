import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      require: true,
    },
    email_verified: {
      type: Boolean,
      require: true,
    },
    examArray: [],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
