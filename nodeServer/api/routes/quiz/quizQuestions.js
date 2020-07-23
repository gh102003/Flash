const express = require("express");
const mongoose = require("mongoose");

const Quiz = require("../../models/quiz/quiz.js");
const QuizQuestion = require("../../models/quiz/quizQuestion.js");
const Category = require("../../models/category");

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const router = express.Router();

// TODO: test file
router.get("/:quizQuestionId", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quiz questions" });
    }

    const quizQuestion = await QuizQuestion.findById(req.params.quizQuestionId).populate("quiz flashcard");

    if (!quizQuestion) {
        return res.status(404).json({ message: "Quiz question not found" });
    }

    if (quizQuestion.quiz.user !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to access this quiz question" });
    }

    return res.status(200).json({ quizQuestion });
});

router.post("/", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quiz questions" });
    }

    // Check the user has permission to access the quiz
    const quiz = await Quiz.findById(req.body.quizQuestion.quiz);
    if (!quiz) {
        return res.status(400).json({ message: "Quiz questions's quiz doesn't exist" });
    }

    if (quiz.user !== req.user.id) {
        return res.status(403).json({ message: "Unauthorised to access quiz question's quiz" });
    }

    const createdQuizQuestion = await new QuizQuestion({ ...req.body }).save();
    return res.status(201).json({createdQuizQuestion});
});

module.exports = router;