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

router.post("/", verifyAuthToken, async (req, res, next) => {

    // Check if containing category is authorised
    if (req.body.category) {
        let category;
        try {
            category = await Category.findById(req.body.category);
        } catch (error) {
            return res.status(400).json({ message: "containing category invalid" });
        }
        if (!category) {
            return res.status(400).json({ message: "containing category invalid" });
        }
        else if (category.user != req.user.id) {
            return res.status(400).json({ message: "containing category unauthorised" });
        }
    }

    // Create new flashcard
    let flashcard;
    try {
        flashcard = new Flashcard({
            _id: new mongoose.Types.ObjectId(),
            ...req.body.flashcard
        });
    } catch (error) {
        return res.status(400).json({ message: "malformed request data" });
    }

    // Save new flashcard
    await flashcard.save();
    try {
        res.status(201).json({ createdFlashcard: flashcard });
    } catch (error) {
        if (error.name === "ValidationError" || error.message.includes("Cast to ObjectId failed")) {
            res.status(400).json({ error });
        } else {
            console.error(error);
            res.status(500).json({ error });
        }
    }
});

/*
 * PATCH requests
 * 
 *  [
 *      {propName: "front", value: "bla bla bla"},
 *      {propName: "back", value: "yeet yeet yeet"},
 *      {propName: "tags", type: "push", value: "2483849238"},
 *      {propName: "tags", type: "pull", value: "7294893862"}
 *  ]
 */
router.patch("/:flashcardId", verifyAuthToken, async (req, res, next) => {
    let flashcard;
    try {
        flashcard = await Flashcard.findById(req.params.flashcardId);
    } catch (error) {
        return res.status(404).json({ message: `No valid flashcard found with id '${req.params.flashcardId}'` });
    }
    if (!flashcard) {
        return res.status(404).json({ message: `No valid flashcard found with id '${req.params.flashcardId}'` });
    }

    // Check if containing category is authorised
    let category;
    try {
        category = await Category.findById(flashcard.category);
    } catch (error) {
        return res.status(400).json({ message: "containing category invalid" });
    }
    if (!category) {
        return res.status(400).json({ message: "containing category invalid" });
    }
    else if (category.user != req.user.id) {
        return res.status(400).json({ message: "containing category unauthorised" });
    }

    let updateOps = {};
    // Use for...of loop to support async/await properly
    for (const op of req.body) {
        if (op.propName === "tags") {
            // If tags are to be edited, operation type must be specified

            if (!op.type) {
                return res.status(400).json({ message: "operation type must be specified for arrays" });
            }

            updateOps = {
                ...updateOps,
                ["$" + op.type]: {
                    ...updateOps[op.type],
                    tags: op.value
                }
            };
        } else {
            // Check if move destination is valid and authenticated
            if (op.propName === "category") {
                let destCategory;
                try {
                    destCategory = await Category.findById(op.value);
                } catch (error) {
                    return res.status(400).json({ message: "move destination is invalid" });
                }
                if (!destCategory) {
                    return res.status(400).json({ message: "move destination is invalid" });
                }
                else if (destCategory.user != req.user.id) {
                    return res.status(401).json({ message: "move destination is unauthorised" });
                }
            }
            // Use $set operation type
            updateOps["$set"] = {
                ...updateOps.$set,
                [op.propName]: op.value
            };
        }
    }
    // Update database
    await flashcard.update(updateOps);
    // Get new details and send in response
    const updatedFlashcard = await Flashcard.findById(req.params.flashcardId);
    res.status(200).json({ updatedFlashcard });
});

router.delete("/:flashcardId", verifyAuthToken, async (req, res, next) => {

    // Get flashcard
    let flashcard;
    try {
        flashcard = await Flashcard.findById(req.params.flashcardId); // Find flashcard to remove 
    } catch (error) {
        return res.status(404).json({ message: `No valid flashcard found with id '${req.params.flashcardId}'` });
    }
    if (!flashcard) {
        return res.status(404).json({ message: `No valid flashcard found with id '${req.params.flashcardId}'` });
    }

    // Check if containing category is authorised
    let category;
    try {
        category = await Category.findById(flashcard.category);
    } catch (error) {
        return res.status(400).json({ message: "containing category invalid" });
    }
    if (!category) {
        return res.status(400).json({ message: "containing category invalid" });
    }
    else if (category.user != req.user.id) {
        return res.status(400).json({ message: "containing category unauthorised" });
    }

    await Flashcard.deleteOne({ _id: req.params.flashcardId });

    return res.status(200).json({ deletedFlashcard: flashcard });
});

module.exports = router;