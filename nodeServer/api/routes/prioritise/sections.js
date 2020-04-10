const express = require("express");
const mongoose = require("mongoose");

const Section = require("../../models/prioritise/section");

const router = express.Router();

router.get("/:sectionId", async (req, res, next) => {
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
    return res.status(200).json(section);
});

module.exports = router;