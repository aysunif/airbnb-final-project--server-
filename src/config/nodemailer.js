const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  service: "gmail",
  debug: true,
  secure: false, // `true` for port 465, `false` for port 587
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS,
  },
});

module.exports = transporter;
