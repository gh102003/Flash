const express = require("express");
const mongoose = require("mongoose");

const Flashcard = require("../models/flashcard");
const Category = require("../models/category");

const verifyAuthToken = require("../middleware/verifyAuthToken");

const router = express.Router();

router.get("/:flashcardId", (req, res, next) => {
    // Find in database
    Flashcard.findById(req.params.flashcardId)
        .populate("tags")
        .then(flashcard => {
            if (flashcard) {
                res.status(200).json(flashcard);
            } else {
                res.status(404).json({
                    message: `No valid flashcard found with id '${req.params.flashcardId}'`
                });
            }
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.post("/", (req, res, next) => {
    const flashcard = new Flashcard({
        _id: new mongoose.Types.ObjectId(),
        ...req.body.flashcard
    });
    flashcard
        .save()
        .then(() => {
            res.status(201).json({
                createdFlashcard: flashcard,
            });
        })
        .catch(error => {
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

/**
 * PATCH requests
 * 
 *  [
 *      {propName: "front", value: "bla bla bla"},
 *      {propName: "back", value: "yeet yeet yeet"},
 *      {propName: "tags", type: "push", value: "2483849238"},
 *      {propName: "tags", type: "pull", value: "7294893862"}
 *  ]
 */
router.patch("/:flashcardId", (req, res, next) => {
    let updateOps = { $set: {} };
    for (const op of req.body) {
        if (op.propName === "tags") {
            // If tags are to be edited, operation type must be specified

            if (!op.type) {
                return res.status(400).json({ error: "operation type must be specified for arrays" });
            }

            updateOps = {
                ...updateOps,
                ["$" + op.type]: {
                    ...updateOps[op.type],
                    tags: op.value
                }
            };
        } else {
            // Otherwise use $set operation type
            updateOps["$set"][op.propName] = op.value;
        }
    }

    Flashcard.findByIdAndUpdate(req.params.flashcardId, updateOps)
        .then(() => {
            return Flashcard.findById(req.params.flashcardId).exec(); // Get new details
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        })
        .then(newFlashcard => {
            if (newFlashcard) return newFlashcard;
            else throw new Error("not found");
        })
        .catch(() => {
            res.status(404).json({ message: `No valid flashcard found with id '${req.params.flashcardId}'` });
        })
        .then(updatedFlashcard => {
            res.status(200).json({ updatedFlashcard });
        });
});

router.delete("/:flashcardId", (req, res, next) => {
    const flashcardId = req.params.flashcardId;
    let deletedFlashcard;

    Flashcard.findById(flashcardId) // Find flashcard to remove 
        .then(flashcard => {
            if (flashcard) deletedFlashcard = flashcard;
            else throw new Error("not found");
        })
        .then(() => {
            return Flashcard.deleteOne({ _id: flashcardId }).exec();
        })
        .then(() => {
            return res.status(200).json({ deletedFlashcard });
        })
        .catch(error => {
            if (error.message === "") {
                return res.status(404).json({ message: `No valid flashcard found with id '${flashcardId}'` });
            } else {
                console.error(error);
                return res.status(500).json({ error });
            }
        });
});

module.exports = router;