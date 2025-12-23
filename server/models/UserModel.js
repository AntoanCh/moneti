import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username must be unique"],
    required: [true, "Username is required"],
    uppercase: true,
  },
  Enabled: {
    type: Boolean,
    required: true,
    default: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const User = mongoose.model("User", userSchema);
