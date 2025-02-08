const express = require("express");
const { createBooking } = require("../controllers/bookingController");
const router = express.Router();

/* CREATE BOOKING */
router.post("/create", createBooking);

module.exports = router;
