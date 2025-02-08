const mongoose = require("mongoose");
const listingSchema = require("../schemas/listing")

const Listing = mongoose.model("Listing", listingSchema )
module.exports = Listing;