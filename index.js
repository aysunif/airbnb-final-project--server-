const express = require('express')
const app = express()
require("dotenv").config()
const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session');
const passport = require('passport')

const authRoutes = require('./src/routes/authRoutes')
const bookingRoutes = require("./src/routes/bookingRoutes");
const listingRoutes = require("./src/routes/listingRoutes");
const userRoutes = require("./src/routes/userRoutes");
const userAuthRoutes = require("./src/routes/userAuthRoutes");
require('./src/config/userPassport')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth",authRoutes)
app.use("/api/bookings", bookingRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth-user", userAuthRoutes);

mongoose.connect(DB_URL)
.then(() => {
    console.log('Connected!')
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
    })
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});