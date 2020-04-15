const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: String,
    subtitle: String,
    imageUrl: { // saved in DB as "/static/img/filename.ext"
        type: String,
        get: imageUrl => process.env.SERVER_ADDRESS + imageUrl
    },
    specificationUrl: String
});

courseSchema.set("toJSON", {
    versionKey: false,
    virtuals: true,
    getters: true,
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

courseSchema.set("toObject", {
    versionKey: false,
    virtuals: true,
    getters: true
});

courseSchema.virtual("sections", {
    ref: "Section",
    localField: "_id",
    foreignField: "course"
});

module.exports = mongoose.model("Course", courseSchema);