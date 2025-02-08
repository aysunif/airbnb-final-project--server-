const express = require("express");
const {
  createListing,
  getListingsByCategory,
  searchListings,
  getListingDetails,
} = require("../controllers/listingController");
const upload = require("../middlewares/upload");

const router = express.Router();

/* ROUTES */
router.post("/create", upload.array("listingPhotos"), createListing);
router.get("/", getListingsByCategory);
router.get("/search/:search", searchListings);
router.get("/:listingId", getListingDetails);

module.exports = router;
