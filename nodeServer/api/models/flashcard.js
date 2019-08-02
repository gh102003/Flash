const mongoose = require("mongoose");

const flashcardSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    front: { type: String, required: true },
    back: { type: String, required: true },
    isReversible: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
});

// Virtuals - generated values that don't really existed
// Don't use arrow functions - they prevent binding 'this'

// Apply a transform to the 'toJSON' function, to change the name of the id key
flashcardSchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

const autoPopulateTags = function(next) {
    this.populate("tags");
    next();
};

flashcardSchema.pre("find", autoPopulateTags);
flashcardSchema.pre("findOne", autoPopulateTags);

module.exports = mongoose.model("Flashcard", flashcardSchema);