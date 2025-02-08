const Booking = require("../models/booking");
const User = require("../models/user");
const Listing = require("../models/listing");

/* GET TRIP LIST */
const getTrips = async (req, res) => {
    try {
      const { userId } = req.params;
      const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId");
      res.status(202).json(trips);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Can not find trips!", error: err.message });
    }
  };

/* ADD/REMOVE LISTING TO/FROM WISHLIST */
const toggleWishlist = async (req, res) => {
    try {
      const { userId, listingId } = req.params;
      const user = await User.findById(userId);
      const listing = await Listing.findById(listingId).populate("creator");
  
      if (!user || !listing) {
        return res.status(404).json({ message: "User or Listing not found" });
      }
  
      const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);
  
      if (favoriteListing) {
        user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
        await user.save();
        res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList });
      } else {
        user.wishList.push(listing);
        await user.save();
        res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: err.message });
    }
  };
  
  /* GET PROPERTY LIST */
  const getProperties = async (req, res) => {
    try {
      const { userId } = req.params;
      const properties = await Listing.find({ creator: userId }).populate("creator");
      res.status(202).json(properties);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Can not find properties!", error: err.message });
    }
  };
  
  /* GET RESERVATION LIST */
  const getReservations = async (req, res) => {
    try {
      const { userId } = req.params;
      const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId");
      res.status(202).json(reservations);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Can not find reservations!", error: err.message });
    }
  };

  module.exports = {
    getTrips,
    toggleWishlist,
    getProperties,
    getReservations,
  };

// 📌 Profil baxışı
// exports.getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password");
//         if (!user) {
//             return res.status(404).json({ message: "İstifadəçi tapılmadı" });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//     }
// };

// 📌 Profil məlumatlarını yeniləmə
// exports.updateProfile = async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         const user = await User.findById(req.user.id);

//         if (!user) {
//             return res.status(404).json({ message: "İstifadəçi tapılmadı" });
//         }

//         user.name = name || user.name;
//         user.email = email || user.email;

//         await user.save();
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//     }
// };

// exports.updateUser = async (req, res) => {
//   try {
//       const { name, email, password } = req.body;
//       const user = await User.findById(req.user.id);

//       if (!user) {
//           return res.status(404).json({ message: "İstifadəçi tapılmadı" });
//       }

//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (password) user.password = await bcrypt.hash(password, 10);

//       await user.save();
//       res.json({ message: "İstifadəçi məlumatları yeniləndi" });
//   } catch (error) {
//       res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//   }
// };


// exports.deleteAccount = async (req, res) => {
//   try {
//       const user = await User.findById(req.user.id);

//       if (!user) {
//           return res.status(404).json({ message: "İstifadəçi tapılmadı" });
//       }

//       await User.deleteOne({ _id: req.user.id });

//       res.json({ message: "Hesab silindi" });
//   } catch (error) {
//       res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//   }
// };

