const express = require("express");
const mongoose = require("mongoose");

const Topic = require("../../models/prioritise/topic");
const TopicRating = require("../../models/prioritise/topicRating");

const verifyAuthToken = require("../../middleware/verifyAuthToken");

const router = express.Router();

// TODO: is this necessary?
router.get("/:topicId", verifyAuthToken, async (req, res, next) => {
    let topic;
    try {
        topic = await Topic.findById(req.params.topicId);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    if (!topic) {
        return res.status(404).json({ message: `No valid topic found with id '${req.params.sectionId}'` });
    }

    // Get rating
    if (req.user.id) {
        const topicRating = await TopicRating.findOne({ user: req.user.id, topic: topic.id });

        return res.status(200).json({ ...topic.toObject(), rating: topicRating.rating || null });
    } else {
        return res.status(200).json(topic);
    }
});

router.patch("/:topicId/rating", verifyAuthToken, async (req, res, next) => {
    if (!req.user.id) {
        return res.status(401).json({ message: "must be logged in to change a rating" });
    }

    const newRating = req.body.rating;
    const topicRating = await TopicRating.findOne({ user: req.user.id, topic: req.params.topicId });

    if (topicRating) {
        // Update if rating already exists
        try {
            await topicRating.update({ $set: { rating: newRating } });
        } catch (error) {
            return res.status(400).json({ message: "invalid rating data supplied" });
        }
        return res.status(200).json({ message: "updated rating successfully" });
    } else {
        // Otherwise create a new rating
        let createdTopicRating;
        try {
            createdTopicRating = new TopicRating({
                user: req.user.id,
                topic: req.params.topicId,
                rating: newRating
            });
            await createdTopicRating.save();
        } catch (error) {
            return res.status(400).json({ message: "invalid rating data supplied" });
        }
        return res.status(201).json({ createdTopicRating });
    }
});

module.exports = router;