const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); 
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_USER,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_USER,
      callbackURL: "https://airbnb-final-project-server.onrender.com/api/auth-user/google/callback",
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

        return done(null, user );
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

