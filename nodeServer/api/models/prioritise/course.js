const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: String,
    subtitle: String,
    imageUrl: String, // TODO: move image url to a server link
    specificationUrl: String
});

courseSchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

courseSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

courseSchema.virtual("sections", {
    ref: "Section",
    localField: "_id",
    foreignField: "course"
});

module.exports = mongoose.model("Course", courseSchema);