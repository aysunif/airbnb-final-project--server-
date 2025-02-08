const mongoose = require("mongoose");
const bookingSchema = require("../schemas/booking");

const Booking = mongoose.model("Booking", bookingSchema)

module.exports = Booking;