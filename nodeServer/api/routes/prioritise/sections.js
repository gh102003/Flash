const express = require("express");
const mongoose = require("mongoose");

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const Section = require("../../models/prioritise/section");
const TopicRating = require("../../models/prioritise/topicRating");

const router = express.Router();

router.get("/:sectionId", verifyAuthToken, async (req, res, next) => {
    let section;
    try {
        section = await Section
            .findById(req.params.sectionId)
            .populate("topics");
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    if (!section) {
        return res.status(404).json({ message: `No valid section found with id '${req.params.sectionId}'` });
    }

    if (req.user.id) {
        // Populate topics with their ratings for the current user
        // Promise.all is very important to make sure that the Query has been resolved
        const topics = await Promise.all(section.topics.map(async topic => {
            
            const topicRating = await TopicRating.findOne({ topic: topic.id, user: req.user.id });
            return { ...topic.toObject(), rating: topicRating && topicRating.rating };
        }));

        return res.status(200).json({...section.toObject(), topics});
    } else {
        return res.status(200).json(section);
    }
});

module.exports = router;