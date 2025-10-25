import express from "express";
import { updateProgress,getProgress } from "../Controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id", updateProgress);
router.get("/", protect, getProgress);

export default router;
