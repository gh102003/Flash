const mongoose = require("mongoose");

const flashcardSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    front: { type: String, required: true },
    back: { type: String, required: true },
    isReversible: { type: Boolean, default: false },
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true}
});

// Virtuals - generated values that don't really existed
// Don't use arrow functions - they prevent binding 'this'

// flashcardSchema.virtual("allowedRequests").get(function () {
//     return ([
//         {
//             url: "/flashcards/" + this._id,
//             method: "GET"
//         },
//         {
//             url: "/flashcards/" + this._id,
//             method: "PATCH",
//             body: [{ propName: "String", value: "String" }],
//             description: "Edits a flashcard using a list of changes"
//         },
//         {
//             url: "/flashcards/" + this._id,
//             method: "DELETE"
//         }
//     ]);
// });

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

module.exports = mongoose.model("Flashcard", flashcardSchema);