const mongoose = require("mongoose");

const topicSchema = mongoose.Schema({
    name: String,
    description: String,
    rating: Number, // TODO: remove and replace with a separate model called topicRating, which belong to users
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    linkedCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    links: [
        {
            name: String,
            url: String
        },
    ]
});

topicSchema.set("toJSON", {
    versionKey: false,
    virtuals: true
});

topicSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

module.exports = mongoose.model("Topic", topicSchema);