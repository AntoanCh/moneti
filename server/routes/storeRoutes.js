import express from "express";
import { Store } from "../models/StoreModel.js";

const router = express.Router();

//Route for saving a new Store
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newStore = {
      name: req.body.name,
      balance: req.body.balance,
      balanceEUR: req.body.balanceEUR,
    };
    const store = await Store.create(newStore);
    return res.status(201).send(store);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route to get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find({});
    return res.status(200).json({
      count: stores.length,
      data: stores,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Get One Store from database by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);

    return res.status(200).json(store);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
//Route for Get One Store from database by name
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const store = await Store.find({ name: name });

    return res.status(200).json(store);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});

//Route for Deleting a Store
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Store.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ messga: "Store not found" });
    }

    return res.status(200).send({ message: "Store Deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
});
export default router;
