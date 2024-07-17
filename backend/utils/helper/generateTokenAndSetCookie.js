import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, //secrity purpose
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict", //for Csrf protection
  });
};

export { generateTokenAndSetCookie };