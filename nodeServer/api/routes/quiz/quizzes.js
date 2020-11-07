const express = require("express");
const mongoose = require("mongoose");

const Quiz = require("../../models/quiz/quiz.js");
const Category = require("../../models/category");

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const router = express.Router();

router.get("/", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quizzes" });
    }

    try {
        const quizzes = await Quiz.find().populate("source.sourceObject");
        return res.status(200).json({ quizzes });
    } catch (error) {
        return res.status(500).json({ message: "Could not get quizzes" });
    }
});

router.get("/category/:categoryId", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quizzes" });
    }

    try {
        const quizzes = await Quiz.find({
            user: req.user.id,
            "source.type": "Category",
            "source.document": req.params.categoryId
        }).populate("questions");

        // TODO: calculate score etc. on server and don't populate questions

        return res.status(200).json({ quizzes });
    } catch (error) {
        return res.status(500).json({ message: "Could not get quizzes" });
    }
});

router.post("/", verifyAuthToken, async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to access your quizzes" });
    }

    // If it is a category quiz, check the category exists and user has permissions to access it
    if (req.body.quiz.source.type === "Category") {
        const category = await Category.findById(req.body.quiz.source.document);

        if (!category) {
            return res.status(400).json({ message: "Quiz's category doesn't exist" });
        }

        if (category.user && category.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorised to access quiz's category" });
        }
    }

    const quiz = new Quiz({ ...req.body.quiz, user: req.user.id });

    const createdQuiz = await quiz.save();

    return res.status(201).json({ createdQuiz });
});

module.exports = router;