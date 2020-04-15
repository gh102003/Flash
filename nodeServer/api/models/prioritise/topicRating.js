const mongoose = require("mongoose");

const topicRatingSchema = mongoose.Schema({
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number
});

topicRatingSchema.set("toJSON", {
    versionKey: false,
    virtuals: true
});

topicRatingSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

module.exports = mongoose.model("TopicRating", topicRatingSchema);