const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/category");
const Flashcard = require("../models/flashcard");

const router = express.Router();

router.get("/", (req, res, next) => {
    Category.find()
        .then(categories => {
            const response = {
                count: categories.length,
                categories
            };
            res.status(200).json(response);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.post("/", (req, res, next) => {
    // Build category
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        ...req.body.category
    });

    // Save category
    category
        .save()
        .then(createdCategory => {
            res.status(201).json({ createdCategory });
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

// Individual categories
router.get("/:categoryId", (req, res, next) => {

    async function deepPopulateParent(category, depth = 0) {
        if (category.parent) {
            category.parent = await Category.findById(category.parent, { getters: true })
                .select("colour parent flashcards children name")
                .populate("flashcards");

            await deepPopulateParent(category.parent, depth + 1);
            return category;
        } else {
            return category;
        }
    }

    async function deepPopulateChildren(category) {
        if (category.children) {
            // Will return array of promises due to async function
            let populatedChildren = await category.children.map(async childCategoryId => {
                var populatedChild = await Category.findById(childCategoryId, { virtuals: true })
                    .select("name colour flashcards children")
                    .populate("flashcards children")
                    .exec();

                await deepPopulateChildren(populatedChild);
                // console.log(populatedChild);
                return populatedChild;
            });
            // Resolve promises and save
            let children = await Promise.all(populatedChildren);
            category.children = children;
        }
        return category;
    }

    // Find in database
    Category
        .findById(req.params.categoryId, { getters: true })
        .select("colour parent flashcards children name")
        .populate("children flashcards")
        .then(category => deepPopulateChildren(category))
        .then(category => deepPopulateParent(category))
        .then(category => {
            if (category) {
                res.status(200).json({ category });
            } else {
                throw new Error("not found");
            }
        })
        .catch(error => {
            console.error(error);
            if (error.message.includes("Cast to ObjectId failed") || error.message === "not found") {
                res.status(404).json({
                    message: `No valid category found with id '${req.params.categoryId}'`
                });
            } else throw error;

        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.patch("/:categoryId", (req, res, next) => {
    const updateOps = {};
    for (const op of req.body) {
        updateOps[op.propName] = op.value;
    }

    Category.findByIdAndUpdate(req.params.categoryId, { $set: updateOps })
        .then(() => {
            return Category.findById(req.params.categoryId).exec(); // Get new details
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        })
        .then(newCategory => {
            if (newCategory) return newCategory;
            else throw new Error("not found");
        })
        .catch(() => {
            res.status(404).json({ message: `No valid category found with id '${req.params.categoryId}'` });
        })
        .then(updatedCategory => {
            res.status(200).json({ updatedCategory });
        });
});

router.delete("/:categoryId", (req, res, next) => {
    let categoryDeleted;

    Category.findById(req.params.categoryId) // Find category to remove 
        .then(category => {
            if (category) categoryDeleted = category;
            else throw new Error("not found");
        })
        .then(() => { // Delete flashcards
            const deleteFlashcards =
                Flashcard.deleteMany({ categoryId: req.params.categoryId }).exec();
            const deleteChildren =
                Category.deleteMany({ parentId: req.params.categoryId }).exec();
            const deleteCategories =
                Category.deleteOne({ _id: req.params.categoryId }).exec();

            return Promise.all([deleteFlashcards, deleteChildren, deleteCategories]);
        })
        .catch(error => {
            if (error.message === "not found") {
                return res.status(404).json({ message: `No valid category found with id '${req.params.categoryId}'` });
            } else throw error;
        })
        .then(() => {
            return res.status(200).json({ categoryDeleted });
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({ error });
        });
});

module.exports = router;