import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const protectRoutes = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token)
      res.status(401).json({ message: "Unauthorized: No Token Provided" });
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken)
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    const user = await sql`
    SELECT * FROM users WHERE id = ${decodedToken.user.id} LIMIT 1;`;
    console.log(`Protected Route User: ${user}`);
    if (user.length === 0)
      return res.status(404).json({ message: "User Not Found" });
    req.user = user[0];
    next();
  } catch (error) {
    console.log("Error in protectRoute: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
