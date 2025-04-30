import mongoose from "mongoose";
import { Store } from "./StoreModel.js";
import { User } from "./UserModel.js";

export const recordSchema = mongoose.Schema(
  {
    time: {
      type: Date,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    edited: {
      type: Boolean,
      required: true,
    },
    editTime: {
      type: Date,
      required: false,
    },
    editValue: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for fuel using recordSchema
export const Record = mongoose.model("Record", recordSchema);
