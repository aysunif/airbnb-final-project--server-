const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { cloudinary } = require("../config/imageCloudinary")


/* USER REGISTER */

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).json({ message: "No profile image uploaded!" });
    }

    const uploadResult = await cloudinary.uploader.upload(profileImage.path, {
      folder: "profile_images",
      allowed_formats: ["jpg", "jpeg", "png"],
    });

    const profileImagePath = uploadResult.secure_url;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Şifrənin hash olunması */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    console.log("newUser: ", newUser);
    await newUser.save();

    res.status(200).json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed!", error: err.message });
  }
};

/* USER LOGIN */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Your account is banned. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };
