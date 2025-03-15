const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Google Auth Route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

// Google Auth Callback Route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

    res.redirect(`https://airbnb-final-project-client-clone1.vercel.app/loginSuccess?token=${token}&user=${JSON.stringify(req.user)}`);
  }
   
  );

module.exports = router;