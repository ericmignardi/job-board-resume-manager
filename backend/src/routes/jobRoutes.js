import { Router } from "express";
import {
  create,
  read,
  readById,
  updateById,
  deleteById,
} from "../controllers/jobController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = Router();

router.post("/", protectRoutes, create);
router.get("/", protectRoutes, read);
router.get("/:id", protectRoutes, readById);
router.put("/:id", protectRoutes, updateById);
router.delete("/:id", protectRoutes, deleteById);

export default router;
