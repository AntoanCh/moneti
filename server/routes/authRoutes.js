import { Register, Login, UpdatePswrd } from "../controllers/authController.js";
import express from "express";
import { userVerification } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", Login);
router.post("/", userVerification);
router.post("/register", Register);
router.post("/updatepswrd", UpdatePswrd);

export default router;
