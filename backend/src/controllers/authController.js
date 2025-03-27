import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All Fields Required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password Must Be At Least 6 Characters" });
    const existingUser = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    console.log(`Existing User: ${existingUser}`);
    if (existingUser.length > 0)
      return res.status(400).json({ message: "Email Already In Use" });
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await sql`
    INSERT INTO users (name, email, password, role) VALUES (${name}, ${email}, ${hashedPassword}, ${role});`;
    console.log(`New User: ${newUser}`);
    const token = jwt.sign({ user: newUser[0] }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    console.log("Successfully Registered User");
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.log("Error in register: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All Fields Required" });
    const existingUser = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    if (!existingUser)
      return res.status(401).json({ message: "Invalid Credentials" });
    const isPasswordValid = bcrypt.compare(password, existingUser[0].password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials" });
    const token = jwt.sign({ user: existingUser[0] }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    console.log("Successfully Logged In");
    res.status(200).json(existingUser[0]);
  } catch (error) {
    console.log("Error in login: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: "0" });
    res.status(200).json({ message: "Successfully Logged Out" });
    console.log("Successfully Logged Out");
  } catch (error) {
    console.log("Error in logout: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verify = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in verify: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
