const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Optimise for searching
        match: /^.{4,25}$/ // Check that it is in the right format
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    },
    encryptedPassword: {
        type: String,
        required: true,
        match: /^.{6,72}$/
    },
    subscription: {
        type: new mongoose.Schema({
            stripeSubscriptionId: String,
            stripeCustomerId: String // Set when user first subscribes
        }),
        required: true
    },
    roles: [{ // Discord-esque roles, e.g. "moderator" or "admin"
        type: String,
    }],
    profilePicture: { // A string representing the filename (excluding extension which will always be '.png') from /res/profile-pictures/[resolution]/
        type: String,
        default: "lion"
    }
});

// Apply a transform to the 'toJSON' function, to change the name of the id key
userSchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);