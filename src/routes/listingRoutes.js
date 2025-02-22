const express = require("express");
const upload = require("../middlewares/upload");
const {
  deleteListing,
  updateListing,
  approveListing,
  getActiveListings,
  createListing,
  getListingsByCategory,
  searchListings,
  getListingDetails,
} = require("../controllers/listingController");

const router = express.Router();

/* ROUTES */
router.post("/create", upload.array("listingPhotos", 10), createListing);
router.get("/", getListingsByCategory);
router.get("/active", getActiveListings); 
router.get("/search/:search", searchListings);
router.get("/:listingId", getListingDetails);
router.put("/:listingId/approve", approveListing); 
router.put("/:listingId", updateListing); 
router.delete("/:listingId", deleteListing);

module.exports = router;
