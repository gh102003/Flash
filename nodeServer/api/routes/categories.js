const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/category");
const Flashcard = require("../models/flashcard");

const verifyAuthToken = require("../middleware/verifyAuthToken");

const router = express.Router();

router.get("/", verifyAuthToken, (req, res, next) => {
    const userId = req.user ? req.user.id : undefined;

    Category.find({ user: userId })
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

router.post("/", verifyAuthToken, async (req, res, next) => {
    // Check parent's user matches authenticated user
    const parentCategory = await Category
        .findById(req.body.category.parent)
        .select("user")
        .exec();

    console.log(req.body.category.parent);


    if (parentCategory.user != req.user.id) {
        return res.status(401).json({ error: "unauthorised" });
    }

    // Build category
    const category = new Category({
        ...req.body.category,
        _id: new mongoose.Types.ObjectId()
    });

    if (req.user.id) {
        category.set("user", req.user.id);
    }

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
router.get("/:categoryId", verifyAuthToken, (req, res, next) => {

    async function deepPopulateParent(category, depth = 0) {
        if (category.parent) {

            category.parent = await Category.findById(category.parent, { getters: true })
                .select("colour parent flashcards children name user");

            await deepPopulateParent(category.parent, depth + 1);
            return category;
        } else {
            return category;
        }
    }

    async function deepPopulateChildren(category) {
        if (category.children) {
            // Will return array of promises due to async function
            let populatedChildren = await category.children
                .map(async child => {
                    var populatedChild = await Category.findById(child._id, { virtuals: true })
                        .select("name colour flashcards children user")
                        // Don't populate if no permissions
                        .populate(child.user == req.user.id ? "flashcards children" : "");
                    // .exec();

                    await deepPopulateChildren(populatedChild);
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
        .select("colour parent flashcards children name user")
        .populate("children flashcards")
        .then(category => {
            if (!category) throw new Error("not found");
            // Don't allow if user is wrong
            else if (category.user != req.user.id) throw new Error("unauthorised");
            else return category;
        })
        .then(category => deepPopulateChildren(category))
        .then(category => deepPopulateParent(category))
        .then(category => {
            res.status(200).json({ category });
        })
        .catch(error => {
            console.error(error);
            if (error.message.includes("Cast to ObjectId failed") || error.message === "not found") {
                res.status(404).json({
                    message: `No valid category found with id '${req.params.categoryId}'`
                });
            } else if (error.message === "unauthorised") {
                res.status(401).json({ error: "unauthorised" });
            } else throw error;
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

router.patch("/:categoryId", verifyAuthToken, async (req, res, next) => {
    const updateOps = {};
    for (const op of req.body) {
        updateOps[op.propName] = op.value;
    }

    // Get category
    let category;
    try {
        await Category.findById(req.params.categoryId);
    } catch (error) {
        return res.status(500).json({ error });
    }

    // Check it exists
    if (!category) {
        return res.status(404).json({ message: `No valid category found with id '${req.params.categoryId}'` });
    }

    // Update if authorised
    if (category.user == req.user.id) {
        await category.update({ $set: updateOps });
    } else {
        return res.status(401).json({ message: "unauthorised" });
    }

    // Get new details
    let updatedCategory;
    try {
        updatedCategory = await Category.findById(req.params.categoryId);
    } catch (error) {
        return res.status(500).json({ error });
    }

    // Respond with updated category
    res.status(200).json({ updatedCategory });
});

router.delete("/:categoryId", verifyAuthToken, async (req, res, next) => {
    // Find category to remove 
    let category;
    try {
        category = await Category.findById(req.params.categoryId);
    } catch (error) {
        return res.status(500).json({ error });
    }
    
    if (!category) {
        return res.status(404).json({ message: `No valid category found with id '${req.params.categoryId}'` });
    }

    // Delete promises
    const deleteFlashcards =
        Flashcard.deleteMany({ categoryId: req.params.categoryId }).exec();
    const deleteChildren =
        Category.deleteMany({ parentId: req.params.categoryId }).exec();
    const deleteCategories =
        Category.deleteOne({ _id: req.params.categoryId }).exec();

    await Promise.all([deleteFlashcards, deleteChildren, deleteCategories]);

    return res.status(200).json({ deletedCategory: category });
});

module.exports = router;