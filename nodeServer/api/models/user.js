const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Optimise for searching
        match: /^.{4,25}$/ // Check that it is in the right format
    },
    encryptedPassword: {
        type: String,
        required: true,
        match: /^.{6,72}$/
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