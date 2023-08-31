// node_modules imports
import express from "express";

//Local imports
import authRoutes from "./auth.route.js";

// creating router
const router = express.Router();

// defining routes that will be used
router.use("/auth", authRoutes);

export default router;
