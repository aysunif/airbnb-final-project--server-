const express = require("express");
const passport = require("passport");
const router = express.Router();
// require("dotenv").config();

// Google Auth Route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

// Google Auth Callback Route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        console.log("Google Auth User:", req.user); // Burada yoxla

        if (!req.user) {
          return res.redirect("http://localhost:5173/login?error=NoUser");
        }
        
      const { token } = req.user;
      res.redirect(`http://localhost:5173/login/${token}/${encodeURIComponent(JSON.stringify(req.user))}`);
    }
  );

module.exports = router;