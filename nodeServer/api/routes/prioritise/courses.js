const express = require("express");
const mongoose = require("mongoose");

const Course = require("../../models/prioritise/course");
const Section = require("../../models/prioritise/section");
const TopicRating = require("../../models/prioritise/topicRating");

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const router = express.Router();

router.get("/", async (req, res, next) => {
    let courses;
    try {
        courses = await Course
            .find()
            .populate("sections");
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    return res.status(200).json({ courses, count: courses.length });
});

router.get("/:courseId", verifyAuthToken, async (req, res, next) => {
    let course;
    try {
        course = await Course
            .findById(req.params.courseId)
            .populate("sections");
    } catch (error) {
        return res.status(500).json({ message: error });
    }

    if (course.sections) {
        // Promise.all is very important to make sure that the Query has been resolved
        const sections = await Promise.all(course.sections.map(async section => {
            const populatedSection = await Section.findById(section.id).populate("topics");

            if (populatedSection.topics && req.user.id) {
                const topics = await Promise.all(populatedSection.topics.map(async topic => {
                    const topicRating = await TopicRating.findOne({ topic: topic.id, user: req.user.id });
                    return { ...topic.toObject(), rating: topicRating && topicRating.rating };
                }));

                return { ...populatedSection.toObject(), topics };
            } else {
                return populatedSection;
            }
        }));
        return res.status(200).json({ ...course.toObject(), sections });
    } else {
        return res.status(200).json(course);
    }

});

module.exports = router;