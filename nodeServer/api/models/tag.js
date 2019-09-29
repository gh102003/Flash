const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    colour: {type: Number, required: true}
});

tagSchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

tagSchema.virtual("flashcards", {
    ref: "Flashcard",
    localField: "_id", // Where this one's id
    foreignField: "tags", // Is a tag on the flashcard
});

module.exports = mongoose.model("Tag", tagSchema);