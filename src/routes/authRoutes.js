const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);

module.exports = router;


