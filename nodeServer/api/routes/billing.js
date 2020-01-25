
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("../models/user");
const credentials = require("../../credentials");
const verifyAuthToken = require("../middleware/verifyAuthToken");

const stripe = require("stripe")(credentials.stripe.secretKey);

const router = express.Router();

// Get a new Stripe checkout session
router.get("/checkout", verifyAuthToken, async (req, res, next) => {

    // TODO: Check if user already has a Flash subscription and update the subscription instead of creating a new one
    const user = await User.findById(req.user.id);

    const session = await stripe.checkout.sessions.create({
        customer_email: user.emailAddress,
        client_reference_id: req.user.id, // Returned by the webhook when the payment is completed
        payment_method_types: ["card"],
        subscription_data: {
            items: [{
                plan: "plan_GabJbtJjesLUYV",
            }],
        },
        success_url: "http://localhost:3000/account/manage-subscription/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/account/manage-subscription",
    });

    return res.status(200).json({ session });
});

// Receives a request from Stripe when the subscription is confirmed
router.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res, next) => {
    const signature = req.headers["stripe-signature"];

    let event;
    try {
        // Try to construct the event that has been sent from Stripe
        event = stripe.webhooks.constructEvent(req.body, signature, credentials.stripe.webhookSecret);
    } catch (err) {
        console.error(err);

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Fulfill the purchase...
        handleCheckoutSession(session);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});

const handleCheckoutSession = async session => {
    const userId = session.client_reference_id;

    await User
        .findById(userId)
        .update({ subscriptionLevel: 1 });
};

module.exports = router;