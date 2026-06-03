import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMe, updateMe, uploadProfile } from "../controllers/userController.js";

const router = express.Router();

// TEST FIRST
router.get("/test", (req, res) => {
  res.json({ message: "User route working" });
});

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/upload-profile", protect, uploadProfile);

export default router;