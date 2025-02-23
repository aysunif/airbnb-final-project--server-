const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); 
const jwt = require("jsonwebtoken");
// require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_USER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_USER,
      callbackURL: "http://localhost:5000/api/auth-user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            googleId: profile.id,
            password: "google-login",
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            profileImagePath: profile.photos[0].value,
          });
          await user.save();
        }

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        //   expiresIn: "5h",
        // });

        return done(null, user );
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// passport.serializeUser((user, done) => { 
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });