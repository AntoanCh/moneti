import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/UserModel.js";
import jsonwebtoken from "jsonwebtoken";

export const userVerification = (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.json({ status: false });
  }
  jsonwebtoken.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      // clients ip gathering
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      if (user)
        return res.json({
          status: true,
          user: user.username,
          id: user._id,
          ip: ip,
        });
      else return res.json({ status: false });
    }
  });
};
