import mongoose from "mongoose";

export const storeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for store using storeSchema
export const Store = mongoose.model("Store", storeSchema);
