// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const sendEmail = async (to, subject, text) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             text,
//         });
//         console.log("✅ Email göndərildi:", to);
//     } catch (error) {
//         console.error("❌ Email göndərilərkən xəta baş verdi:", error.message);
//     }
// };

// module.exports = sendEmail;
