const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    source: {
        type: { type: String, enum: ["Tag", "Category"] }, // used to determine type of source.document
        document: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "source.quizType"
        }
    },
});

quizSchema.virtual("questions", {
    ref: "Quiz",
    localField: "id",
    foreignField: "quiz"
});

quizSchema.set("toJSON", {
    versionKey: false,
    virtuals: true
});

quizSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

module.exports = mongoose.model("Quiz", quizSchema);