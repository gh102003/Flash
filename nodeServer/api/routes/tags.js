const express = require("express");
const mongoose = require("mongoose");

const Tag = require("../models/tag");

const router = express.Router();

router.get("/:tagId", (req, res, next) => {
    // Find in database
    Tag.findById(req.params.tagId)
        .populate("flashcards")
        .then(tag => {
            if (tag) {
                res.status(200).json(tag);
            } else {
                res.status(404).json({
                    message: `No valid tag found with id '${req.params.tagId}'`
                });
            }
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.get("/", (req, res, next) => {
    Tag.find()
        .then(tags => {
            const response = {
                count: tags.length,
                tags
            };
            res.status(200).json(response);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.post("/", (req, res, next) => {
    const tag = new Tag({
        _id: new mongoose.Types.ObjectId(),
        ...req.body.tag
    });
    tag
        .save()
        .then(() => {
            res.status(201).json({
                createdTag: tag,
            });
        })
        .catch(error => {
            console.error(error);
            if (error.name === "ValidationError" || error.message.includes("Cast to ObjectId failed")) {
                res.status(400).json({ error });
            } else {
                throw error;
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.patch("/:tagId", (req, res, next) => {
    const updateOps = {};
    for (const op of req.body) {
        updateOps[op.propName] = op.value;
    }

    Tag.findByIdAndUpdate(req.params.tagId, { $set: updateOps })
        .then(() => {
            return Tag.findById(req.params.tagId).exec(); // Get new details
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        })
        .then(newTag => {
            if (newTag) return newTag;
            else throw new Error("not found");
        })
        .catch(() => {
            res.status(404).json({ message: `No valid tag found with id '${req.params.tagId}'` });
        })
        .then(updatedTag => {
            res.status(200).json({ updatedTag });
        });
});

router.delete("/:tagId", (req, res, next) => {
    const tagId = req.params.tagId;
    let deletedTag;

    Tag.findById(tagId) // Find tag to remove 
        .then(tag => {
            if (tag) deletedTag = tag;
            else throw new Error("not found");
        })
        .then(() => {
            return Tag.deleteOne({ _id: tagId }).exec();
        })
        .then(() => {
            return res.status(200).json({ deletedTag });
        })
        .catch(error => {
            if (error.message === "") {
                return res.status(404).json({ message: `No valid tag found with id '${tagId}'` });
            } else {
                console.error(error);
                return res.status(500).json({ error });
            }
        });
});

module.exports = router;