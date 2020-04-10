const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema({
    name: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
});

sectionSchema.virtual("topics", {
    ref: "Topic",
    localField: "_id",
    foreignField: "section"
});

sectionSchema.set("toJSON", {
    versionKey: false,
    virtuals: true
});

sectionSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

module.exports = mongoose.model("Section", sectionSchema);