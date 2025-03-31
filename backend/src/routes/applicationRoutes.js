import { Router } from "express";
import {
  create,
  read,
  readById,
  updateById,
} from "../controllers/applicationController.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = Router();

// router.post("/", protectRoutes, create);
router.post("/:jobId", protectRoutes, create);
router.get("/", protectRoutes, read);
router.get("/:jobId", protectRoutes, readById);
router.put("/:id", protectRoutes, updateById);

export default router;
