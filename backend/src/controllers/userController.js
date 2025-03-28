import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";

export const read = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await sql`
    SELECT * FROM users WHERE id = ${id};`;
    if (user.length === 0)
      return res.status(404).json({ message: "Error Reading User" });
    console.log("Successfully Read User");
    res.status(200).json(user[0]);
  } catch (error) {
    console.log("Error in read: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  const { id } = req.user;
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All Fields Required" });
    const existingUser = await sql`
    SELECT * FROM users WHERE id = ${id};`;
    if (existingUser.length === 0)
      return res.status(404).json({ message: "Error Reading User" });
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await sql`
    UPDATE users 
    SET name = ${name}, email = ${email}, password = ${hashedPassword}, role = ${role} 
    WHERE id = ${id} 
    RETURNING *;`;
    if (updatedUser.length === 0)
      return res.status(400).json({ message: "Error Updating User" });
    console.log("Successfully Updated User");
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.log("Error in update: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
