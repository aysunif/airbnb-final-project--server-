const express = require("express");
const { getTrips, toggleWishlist, getProperties, getReservations } = require("../controllers/userController");
// const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:userId/trips", getTrips);
router.patch("/:userId/:listingId", toggleWishlist);
router.get("/:userId/properties", getProperties);
router.get("/:userId/reservations", getReservations);

module.exports = router;


// router.use((req, res, next) => {
//     console.log("Request Received: ", req.method, req.url); 
//     next();
// });

// router.get("/profile", authMiddleware, getProfile);
// router.put("/profile", authMiddleware, updateProfile);
// router.delete("/delete", authMiddleware, deleteAccount);

