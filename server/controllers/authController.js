import { User } from "../models/UserModel.js";
import { Store } from "../models/StoreModel.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcrypt";

//REGISTER USER
export const Register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ status: "fail", message: "User already exists" });
    }
    const hasedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ ...req.body, password: hasedPassword });
    //create store alongside user with the same name ---- OLDER VERSION
    // const store = await Store.create({ name: username, balance: 0 });

    //Assign JWT TOKEN to the user
    const token = createSecretToken(user._id);

    res.status(201).json({
      status: "success",
      message: "role registered successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

//UPDATE USER PASSWORD
export const UpdatePswrd = async (req, res, next) => {
  try {
    const { password, _id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(_id, {
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      message: "password updated successfully",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

//LOGGING USER
export const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "Incorect password or username" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "incorect password or username" });
    }
    const token = createSecretToken(user._id);

    res.status(201).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};
