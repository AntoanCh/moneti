import express from "express";
import { User } from "../models/UserModel.js";
import { Store } from "../models/StoreModel.js";

const router = express.Router();

//Route for Get All Users from database
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One user from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a User
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    // OLDER VERSION
    // const store = await Store.findOneAndDelete({ name: result.username });
    // if (!store) {
    //   return res
    //     .status(200)
    //     .send({ message: "User Deleted, Store not deleted" });
    // }
    return res.status(200).send({ message: "User Deleted, Store Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

export default router;
