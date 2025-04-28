import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import recordRoutes from "./routes/recordRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";

const { MONGO_URL, PORT } = process.env;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MIDDLEWARES
//Middleware for handling CORS
app.use(cors());
//cookieparser middleware
app.use(cookieParser());
//Middleware for parsing request body
app.use(express.json());

//ROUTES

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
// app.use("/api/logs", logRoutes);
app.use("/api/records", recordRoutes);

//MONGODB CONNECTION

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("App connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB:", err);
  });

//SERVER
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
