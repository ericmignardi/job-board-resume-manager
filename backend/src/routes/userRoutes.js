import { Router } from "express";
import { read, update } from "../controllers/userController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = Router();

router.get("/", protectRoutes, read);
router.put("/", protectRoutes, update);

export default router;
