const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);

module.exports = router;

// router.get("/verify/:token", verifyEmail);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

