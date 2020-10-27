const express = require("express");
const mongoose = require("mongoose");

const Quiz = require("../../models/quiz/quiz.js");
const QuizQuestion = require("../../models/quiz/quizQuestion.js");
const Category = require("../../models/category");
const Flashcard = require("../../models/flashcard");
const checkFlashcardAccessPermissions = require("../../routes/flashcards").checkFlashcardAccessPermissions;

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const router = express.Router();

router.get("/:quizQuestionId", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quiz questions" });
    }

    const quizQuestion = await QuizQuestion.findById(req.params.quizQuestionId).populate("quiz flashcard");

    if (!quizQuestion) {
        return res.status(404).json({ message: "Quiz question not found" });
    }

    if (quizQuestion.quiz.user != req.user.id) {
        return res.status(403).json({ message: "You don't have permission to access this quiz question" });
    }

    return res.status(200).json({ quizQuestion });
});

router.post("/", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to add a quiz question" });
    }

    // Check the quiz exists
    const quiz = await Quiz.findById(req.body.quizQuestion.quiz);
    if (!quiz) {
        return res.status(400).json({ message: "Quiz questions's quiz doesn't exist" });
    }

    // Check for permission to access quizQuestion's flashcard
    const flashcard = await Flashcard.findById(req.body.quizQuestion.flashcard);
    if (!flashcard) {
        return res.status(400).json({ message: "Quiz questions's flashcard doesn't exist" });
    }
    const hasFlashcardPerms = await checkFlashcardAccessPermissions(flashcard, req.user.id, false);
    if (!hasFlashcardPerms) {
        return res.status(403).json({ message: "Unauthorised to access quiz question's flashcard" });
    }

    if (quiz.user != req.user.id) {
        return res.status(403).json({ message: "Unauthorised to access quiz question's quiz" });
    }

    // Check the flashcard is in the quiz's category
    if (quiz.source.type === "Category") {
        if (flashcard.category.toString() != quiz.source.document.toString()) {
            return res.status(400).json({ message: "Quiz question's flashcard must be part of the quiz question's quiz's category" });
        }
    }

    if (!req.body.quizQuestion.correct) {
        req.body.quizQuestion.correct = null;
    }

    try {
        const createdQuizQuestion = await new QuizQuestion({ ...req.body.quizQuestion }).save();
        return res.status(201).json({ createdQuizQuestion });
    } catch (error) {
        return res.status(400).json({ message: "invalid parameter supplied" });
    }
});

module.exports = router;