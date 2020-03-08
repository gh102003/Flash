
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("../models/user");
const credentials = require("../../credentials");
const verifyAuthToken = require("../middleware/verifyAuthToken");

const stripe = require("stripe")(credentials.stripe.secretKey);
stripe.setMaxNetworkRetries(2);

const router = express.Router();

// Get a new Stripe checkout session
router.get("/checkout", verifyAuthToken, async (req, res, next) => {

    const user = await User.findById(req.user.id);
    const currentSubscription = user.subscription.stripeSubscriptionId && await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);

    let data;
    if (currentSubscription
        && currentSubscription.plan.id === process.env.STRIPE_PLAN
        && (currentSubscription.status === "active" || currentSubscription.status === "trialing")) {
        // Create a setupintent with customer and subscription metadata, for later updating payment method on server in the webhook

        data = {
            setup_intent_data: {
                metadata: {
                    customer_id: user.subscription.stripeCustomerId,
                    subscription_id: user.subscription.stripeSubscriptionId
                }
            },
            customer_email: user.emailAddress,
            mode: "setup",
            success_url: process.env.ADDRESS + "/account/subscription/updated-payment"
        };
    } else {

        // Check the user's email address is verified
        if (!user.verifiedEmail) {
            return res.status(401).json({ message: "email address must be verified before starting a subscription" });
        }

        let stripeCustomerId = user.subscription && user.subscription.stripeCustomerId;

        // Create a Stripe customer if the user does not have one already
        try {
            if (!stripeCustomerId) {
                stripeCustomerId = await stripe.customers.create({
                    email: user.emailAddress,
                });
            }
        } catch (error) {
            return res.status(500).json({ error });
        }

        // Create a new subscription
        data = {
            // Returned by the webhook when the payment is completed, used to update database
            client_reference_id: req.user.id,
            customer: stripeCustomerId,
            subscription_data: {
                items: [{
                    plan: process.env.STRIPE_PLAN,
                }]
            },
            mode: "subscription",
            success_url:  process.env.ADDRESS + "/account/subscription/started"
        };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            cancel_url:  process.env.ADDRESS + "/account/subscription",
            ...data
        });

        return res.status(200).json({ session });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/apply-coupon", bodyParser.json(), verifyAuthToken, async (req, res, next) => {
    const user = await User.findById(req.user.id);
    let stripeCustomerId = user.subscription && user.subscription.stripeCustomerId;

    if (req.body.couponCode === undefined) {
        return res.status(400).json({ message: "a coupon code or 'null' must be supplied" });
    }

    // Create Stripe customer if they don't have one already, otherwise update with coupon code
    try {
        if (!stripeCustomerId) {
            // Create Stripe customer with coupon code
            const stripeCustomer = await stripe.customers.create({
                email: user.emailAddress,
                coupon: req.body.couponCode
            });
            // Save Stripe customer id to database
            await user.update({ subscription: { stripeCustomerId: stripeCustomer.id } });
        } else {
            // Update customer with coupon
            await stripe.customers.update(stripeCustomerId, {
                coupon: req.body.couponCode
            });
        }
    } catch (error) {
        // If coupon code is invalid
        if (error.code === "resource_missing" && error.param === "coupon") {
            return res.status(400).json({ message: "invalid coupon code" });
        } else {
            return res.status(400).json({ message: "could not apply coupon code" });
        }
    }

    return res.status(200).json({
        message: "applied coupon code successfully",
        couponCode: req.body.couponCode
    });
});

router.get("/cancel-subscription", verifyAuthToken, async (req, res, next) => {
    // Get subscription id from database
    const user = await User.findById(req.user.id);
    const subscriptionId = user.subscription.stripeSubscriptionId;

    // Cancel subscription on Stripe, but don't update database until webhook
    // responds in case the subscription is deleted from the dashboard manually
    try {
        await stripe.subscriptions.del(subscriptionId);
        return res.status(200).json({ message: "subscription cancelled" });
    } catch (error) {
        return res.status(500).json({ message: "subscription could not be cancelled", error });
    }
});

router.get("/invoice-history", verifyAuthToken, async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // Return empty array if there is no Stripe customer
    if (!user.subscription || !user.subscription.stripeCustomerId) {
        return res.status(200).json({ invoices: [] });
    }

    // Only returns last 10
    const invoices = await stripe.invoices.list({ customer: user.subscription.stripeCustomerId });

    return res.status(200).json({ invoices: invoices.data });
});

// Receives a request from Stripe when the subscription is confirmed
router.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res, next) => {
    const signature = req.headers["stripe-signature"]; // Used to verify that the event was sent by Stripe

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

        // Fulfill the purchase
        if (session.mode === "setup") {
            handleUpdatePaymentDetails(session);
        } else {
            handleFulfillment(session);
        }
    } else if (event.type === "customer.subscription.deleted") {
        const subscriptionId = event.data.object.id;
        handleCancelSubscription(subscriptionId);
    }

    // Return a response to acknowledge receipt of the event
    return res.json({ received: true });
});

const handleUpdatePaymentDetails = async session => {
    // Get setupintent from Stripe using data from checkout
    const setupIntent = await stripe.setupIntents.retrieve(session.setup_intent);

    // Attach payment method to customer
    await stripe.paymentMethods.attach(setupIntent.payment_method, {
        customer: setupIntent.metadata.customer_id
    });

    // Change the default payment method of the subscription (it is initially set by checkout when the subscription is created)
    await stripe.subscriptions.update(setupIntent.metadata.subscription_id, {
        default_payment_method: setupIntent.payment_method
    });
};

const handleFulfillment = async session => {
    const userId = session.client_reference_id;

    await User
        .findById(userId)
        .updateOne({
            subscription: {
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription
            }
        });
};

const handleCancelSubscription = async subscriptionId => {
    // Find the user with the subscription's id and remove their subscription
    await User
        .find({
            "subscription.stripeSubscriptionId": subscriptionId
        })
        .updateOne({
            $unset: {
                "subscription.stripeSubscriptionId": 1
            }
        });
};

module.exports = router;