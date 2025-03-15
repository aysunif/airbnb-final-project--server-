const Listing = require("../models/listing");
const { cloudinary } = require("../config/imageCloudinary")
const User = require("../models/user");


/* CREATE LISTING */
const createListing = async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.");
    }

    const listingPhotoUrls = [];

    for (let file of listingPhotos) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "listings_photos",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      });

      listingPhotoUrls.push(uploadResult.secure_url);
    }

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths: listingPhotoUrls,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();

    res.status(200).json(newListing);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(409).json({
      message: "Fail to create Listing",
      error: err.message,
    });
  }
};

/* GET LISTINGS BY CATEGORY */
const getListingsByCategory = async (req, res) => {
  const qCategory = req.query.category;

  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory, isApproved: true }).populate("creator");
    } else {
      listings = await Listing.find().populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({
      message: "Fail to fetch listings",
      error: err.message,
    });
  }
};

/* GET LISTINGS BY SEARCH */
const searchListings = async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];

    if (search === "all") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({
      message: "Fail to fetch listings",
      error: err.message,
    });
  }
};

/* LISTING DETAILS */
const getListingDetails = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(200).json(listing);
  } catch (err) {
    res.status(404).json({
      message: "Listing cannot be found!",
      error: err.message,
    });
  }
};

/* GET ACTIVE LISTINGS */
const getActiveListings = async (req, res) => {
  try {
    console.log("Fetching active listings...");

    const listings = await Listing.find({ isApproved: true });

    console.log("Listings found:", listings);

    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err.message);

    res.status(500).json({
      message: "Failed to fetch active listings",
      error: err.message,
    });
  }
};


/* APPROVE LISTING */
const approveListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { isApproved: true },
      { new: true }
    ).populate("creator");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing approved successfully", listing });
  } catch (err) {
    res.status(500).json({
      message: "Failed to approve listing",
      error: err.message,
    });
  }
};

/* UPDATE LISTING */
const updateListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const updates = req.body;

    const listing = await Listing.findByIdAndUpdate(listingId, updates, {
      new: true,
    }).populate("creator");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing updated successfully", listing });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update listing",
      error: err.message,
    });
  }
};

/* DELETE LISTING */
const deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findByIdAndDelete(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete listing",
      error: err.message,
    });
  }
};

const addRating = async (req, res) => {
  const { listingId, userId, rating } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRatingIndex = listing.rating.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      listing.rating[existingRatingIndex].rating = rating;
    } else {
      listing.rating.push({ userId, rating });
    }

    const totalRatings = listing.rating.reduce((sum, r) => sum + r.rating, 0);
    listing.averageRating = totalRatings / listing.rating.length;

    await listing.save();

    res.status(200).json({ message: "Rating added/updated successfully!", listing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  addRating,
  deleteListing,
  updateListing,
  approveListing,
  getActiveListings,
  createListing,
  getListingsByCategory,
  searchListings,
  getListingDetails,
};
