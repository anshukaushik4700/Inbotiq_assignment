import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Welcome ${user.name}, ${user.role}!`,
      user,
    });
  } catch (error) {
    console.error("Dashboard route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
