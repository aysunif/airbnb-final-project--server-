const Booking = require("../models/booking");
const User = require("../models/user");
const Listing = require("../models/listing");
const transporter = require("../config/nodemailer");
const cloudinary = require("../config/imageCloudinary").cloudinary;

/* GET ALL USER */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find users!", error: err.message });
  }
};

/* GET USER BY ID */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Can not find user!", error: err.message });
  }
};

/* BAN/UNBAN USER */
const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    await transporter
      .sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Ban warning | Airbnb",
        html: `<h1>${
          user.isBanned ? "Your account is banned" : "Your ban has been lifted"
        }</h1>
      <p>${
        user.isBanned
          ? "Your account has been banned for violating our policies."
          : "Your account is no longer banned. You can access your account again."
      }</p>`,
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    res
      .status(200)
      .json({
        message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
        user,
      });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPLOAD PROFILE IMAGE */
const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path);
    res.status(200).json({ profileImagePath: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE USER */
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileImage = req.file;

    let updates;

    if(profileImage) {
      const uploadResult = await cloudinary.uploader.upload(profileImage.path, {
        folder: "profile_images",
        allowed_formats: ["jpg", "jpeg", "png", "svg"],
      });

      const profileImagePath = uploadResult.secure_url;

      updates = {
        ...req.body,
        profileImagePath: profileImagePath,
      }

    }else{
      updates = {...req.body};
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");
console.log(user)


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   console.log(user)
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* DELETE USER */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* GET TRIP LIST */
const getTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );
    res.status(202).json(trips);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Can not find trips!", error: err.message });
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

    const favoriteListing = user.wishList.find(
      (item) => item._id.toString() === listingId
    );

    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res
        .status(200)
        .json({
          message: "Listing is removed from wish list",
          wishList: user.wishList,
        });
    } else {
      user.wishList.push(listing);
      await user.save();
      res
        .status(200)
        .json({
          message: "Listing is added to wish list",
          wishList: user.wishList,
        });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* GET PROPERTY LIST */
const getProperties = async (req, res) => {
  try {
    const { userId } = req.params;
    const properties = await Listing.find({ creator: userId }).populate(
      "creator"
    );
    res.status(202).json(properties);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Can not find properties!", error: err.message });
  }
};

/* GET RESERVATION LIST */
const getReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Booking.find({ hostId: userId }).populate(
      "customerId hostId listingId"
    );
    res.status(202).json(reservations);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Can not find reservations!", error: err.message });
  }
};

module.exports = {
  getTrips,
  toggleWishlist,
  getProperties,
  getReservations,
  getAllUsers,
  getUserById,
  toggleBanUser,
  uploadProfileImage,
  updateUser,
  deleteUser,
};

