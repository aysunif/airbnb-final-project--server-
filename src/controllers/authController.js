const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* USER REGISTER */

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file; 

    if (!profileImage) {
      return res.status(400).json({ message: "No profile image uploaded!" });
    }

    const profileImagePath = profileImage.path;

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

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }
    
    /* Şifrənin doğrulanması */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    /* JWT token yaradılır */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    const { password: _, ...userData } = user.toObject();
    
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };

// 📌 Email doğrulama
// exports.verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({ email: decoded.email });

//     if (!user) {
//       return res.status(400).json({ message: "İstifadəçi tapılmadı" });
//     }

//     user.isVerified = true;
//     user.verificationToken = null;
//     await user.save();

//     res.json({ message: "Email uğurla doğrulandı" });
//   } catch (error) {
//     res.status(400).json({ message: "Token etibarsızdır və ya vaxtı keçib" });
//   }
// };

// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "İstifadəçi tapılmadı" });
//     }

//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 dəqiqə

//     await user.save();

//     const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
//     await sendEmail(
//       email,
//       "Şifrəni sıfırlayın",
//       `Şifrəni sıfırlamaq üçün bu linkə keçid edin: ${resetLink}`
//     );

//     res.json({ message: "Şifrəni sıfırlamaq üçün email göndərildi" });
//   } catch (error) {
//     res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user || user.resetPasswordExpires < Date.now()) {
//       return res
//         .status(400)
//         .json({ message: "Token etibarsız və ya vaxtı keçib" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     await user.save();
//     res.json({ message: "Şifrə uğurla yeniləndi" });
//   } catch (error) {
//     res.status(500).json({ message: "Xəta baş verdi", error: error.message });
//   }
// };
