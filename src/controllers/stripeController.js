const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Controller function to create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice } = req.body; // totalPrice from the frontend

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe works in cents (hence multiplying by 100)
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createPaymentIntent };
