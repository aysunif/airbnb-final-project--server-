const Booking = require("../models/booking");

/* CREATE BOOKING */
const createBooking = async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    await newBooking.save();
    res.status(200).json(newBooking);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to create a new Booking!",
      error: err.message,
    });
  }
};

/* CREATE PAYMENT */


// const payment = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const user = await User.findById({ _id: id, isDeleted: false });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         status: "fail",
//       });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         isPremium: true,
//         premiumSince: new Date(),
//       },
//       { new: true }
//     );

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 500, 
//       currency: "usd",
//     });

//     await transporter
//       .sendMail({
//         from: process.env.MAIL_USER,
//         to: updatedUser.email,
//         subject: "Payment | Airbnb",
//         html:` <h1>You paid $5</h1><h3>If you did not send this request, you can ignore this email.</h3>`,
//       })
//       .catch((error) => {
//         console.log("Error sending email:", error);
//       });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).send({ error: error.message });
//   }
// };

module.exports = { createBooking };
