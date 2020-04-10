const express = require("express");
const mongoose = require("mongoose");

const Topic = require("../../models/prioritise/topic");

const router = express.Router();

// TODO: is this necessary?
router.get("/:topicId", async (req, res, next) => {
    let topic;
    try {
        topic = await Topic.findById(req.params.topicId);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
    if (!topic) {
        return res.status(404).json({ message: `No valid topic found with id '${req.params.sectionId}'` });
    }
    return res.status(200).json(topic);
});

module.exports = router;