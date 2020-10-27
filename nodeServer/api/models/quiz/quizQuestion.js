const mongoose = require("mongoose");
const flashcard = require("../flashcard.js");

const Quiz = require("./quiz");

const quizQuestionSchema = mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    correct: {
        type: Boolean,
        required: false
    },
    flashcard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard"
    },
    questionSide: {
        type: String,
        enum: ["front", "back"]
    }
});

quizQuestionSchema.set("toJSON", {
    versionKey: false,
    virtuals: true
});

quizQuestionSchema.set("toObject", {
    versionKey: false,
    virtuals: true
});

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);