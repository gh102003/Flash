const express = require("express");
const mongoose = require("mongoose");

const Course = require("../../models/prioritise/course");
const Section = require("../../models/prioritise/section");

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

router.get("/:courseId", async (req, res, next) => {
    let course;
    try {
        course = await Course
            .findById(req.params.courseId)
            .populate("sections");
    } catch (error) {
        return res.status(500).json({ message: error });
    }

    // Promise.all is very important to make sure that the Query has been resolved
    const sections = await Promise.all(course.sections.map(async section =>
        await Section.findById(section.id).populate("topics")
    ));

    return res.status(200).json({ ...course.toObject(), sections });
});

module.exports = router;