const express = require("express");
const {
    getTrips,
    toggleWishlist,
    getProperties,
    getReservations,
    getAllUsers,
    getUserById,
    toggleBanUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/:userId/trips", getTrips);
router.patch("/:userId/:listingId", toggleWishlist);
router.get("/:userId/properties", getProperties);
router.get("/:userId/reservations", getReservations);

router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.put("/:userId/ban", toggleBanUser);
router.put("/:userId", updateUser);
router.post("/uploadProfileImage", upload.single("file"), uploadProfileImage);
router.delete("/:userId", deleteUser);


module.exports = router;


