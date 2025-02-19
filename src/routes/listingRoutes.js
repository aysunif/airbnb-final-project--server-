const express = require("express");
const upload = require("../middlewares/upload");
const {
  createListing,
  getListingsByCategory,
  searchListings,
  getListingDetails,
} = require("../controllers/listingController");

const router = express.Router();

/* ROUTES */
router.post("/create", upload.array("listingPhotos", 10), createListing);
router.get("/", getListingsByCategory);
router.get("/search/:search", searchListings);
router.get("/:listingId", getListingDetails);

module.exports = router;
