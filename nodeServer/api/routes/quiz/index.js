const express = require("express");

const quizRoutes = require("./quizzes");
const quizQuestionRoutes = require("./quizQuestions");

const router = express.Router();

router.use("/quizzes", quizRoutes);
router.use("/quizQuestions", quizQuestionRoutes);

module.exports = router;