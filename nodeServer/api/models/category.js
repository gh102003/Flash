const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    colour: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});

// Apply a transform to the 'toJSON' function, to change the name of the id key
categorySchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

categorySchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

// categorySchema.virtual("allowedRequests").get(function () {
//     return ([
//         {
//             url: "/categories/" + this._id,
//             method: "GET",
//             description: "Provides category information including its child categories and flashcards"
//         },
//         {
//             url: "/categories/" + this._id,
//             method: "PATCH",
//             body: [{ propName: "String", value: "String" }],
//             description: "Edits a category using a list of changes"
//         },
//         {
//             url: "/categories/" + this._id,
//             method: "DELETE"
//         }
//     ]);
// });

// Virtual population - create lists of documents with this category referenced

categorySchema.virtual("children", {
    ref: "Category",
    localField: "_id", // Where this one's id
    foreignField: "parent", // Is the same as that one's parentId
});

categorySchema.virtual("flashcards", {
    ref: "Flashcard",
    localField: "_id", // Where this one's id
    foreignField: "category" // Is the same as that one's parentId
});

module.exports = mongoose.model("Category", categorySchema);