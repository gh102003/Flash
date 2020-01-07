const express = require("express");
const mongoose = require("mongoose");
const Category = require("../models/category");
const Flashcard = require("../models/flashcard");
const User = require("../models/user");

const verifyAuthToken = require("../middleware/verifyAuthToken");

const router = express.Router();

/**
 * Populates a category's parents as far as possible
 * @param {mongoose.Document} category the category to populate
 * @param {(parentCategory: mongoose.Document) => mongoose.Document} innerFunction a function to run for every parent, return a value to intercept and change the parent
 * @param {number} depth used internally to track recursion depth
 */
const deepPopulateParent = async (category, innerFunction, depth = 0) => {
    if (category.parent) {
        // if (depth === 0) {
        //     console.time("deepPopulateParent");
        // }

        category.parent = await Category.findById(category.parent, { getters: true })
            .select("colour parent flashcards children name user locked");

        innerFunction(category.parent);

        await deepPopulateParent(category.parent, innerFunction, depth + 1);
        
        // if (depth === 0) {
        //     console.timeEnd("deepPopulateParent");
        // }
        return category;
    } else {
        return category;
    }
};

/**
 * Populates a category's children as far as possible, as long as the authentication is correct
 * @param {mongoose.Document} category 
 * @param {*} authenticatedUserId 
 * @param {(category: mongoose.Document, childCategory: mongoose.Document) => mongoose.Document} innerFunction a function to run for every authenticated child, return a value to intercept and change the child
 */
const deepPopulateChildren = async (category, authenticatedUserId, innerFunction) => {
    if (category.children) {
        // Will return array of promises due to async function
        let populatedChildren = await category.children
            .map(async child => {
                let populatedChild = await Category.findById(child._id, { virtuals: true })
                    .select("name colour flashcards children user locked")
                    // Don't populate if no permissions
                    .populate(child.user == authenticatedUserId ? "flashcards children" : "");

                if (!populatedChild) {
                    return Promise.resolve();
                }

                const returnedFromInnerFunction = innerFunction(category, populatedChild);
                if (returnedFromInnerFunction) {
                    populatedChild = returnedFromInnerFunction;
                }

                await deepPopulateChildren(populatedChild, authenticatedUserId, innerFunction);
                return populatedChild;
            });
        // Resolve promises and save
        let children = await Promise.all(populatedChildren);
        category.children = children;
    }
    return category;
};

router.get("/", verifyAuthToken, (req, res, next) => {
    Category.find({ user: req.user.id })
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

    if (parentCategory.user && parentCategory.user != req.user.id) {
        return res.status(401).json({ message: "unauthorised" });
    }

    // Make sure the parent isn't locked

    // Build category
    const category = new Category({
        ...req.body.category,
        _id: new mongoose.Types.ObjectId()
    });

    if (parentCategory.user) {
        category.set("user", parentCategory.user);
    }

    // Save category
    category
        .save()
        .then(createdCategory => {
            res.status(201).json({ createdCategory });
        })
        .catch(error => {
            if (error.name === "ValidationError" || error.message.includes("Cast to ObjectId failed")) {
                res.status(400).json({ message: error });
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

    let inheritedLocked = false; // If the category is locked implicitly by one of its ancestors

    // Find in database
    Category
        .findById(req.params.categoryId, { getters: true })
        .select("colour parent flashcards children name user locked")
        .populate("children flashcards")
        .then(category => {
            if (!category) throw new Error("not found");
            // Don't allow if user is wrong, but do allow if the category has no user (and is public)
            else if (category.user && category.user != req.user.id) throw new Error("unauthorised");
            else return category;
        })
        .then(category => deepPopulateParent(category, parentCategory => {
            if (parentCategory.locked) {
                inheritedLocked = true;
            }
        }))
        .then(category => deepPopulateChildren(category, req.user.id, (parentCategory, childCategory) => {
            if (parentCategory.locked || inheritedLocked && childCategory.locked === false) {
                return childCategory = { ...childCategory.toJSON(), locked: "inherited" };
            }
        }))
        .then(category => {
            if (category.locked) {
                res.status(200).json({ category });
            } else {
                res.status(200).json({
                    category: {
                        ...category.toJSON(),
                        locked: inheritedLocked ? "inherited" : false
                    }
                });
            }
        })
        .catch(error => {
            console.error(error);
            if (error.message.includes("Cast to ObjectId failed") || error.message === "not found") {
                res.status(404).json({
                    message: `No valid category found with id '${req.params.categoryId}'`
                });
            } else if (error.message === "unauthorised") {
                res.status(401).json({ message: "unauthorised" });
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

        // Check if move destination is valid and authenticated
        if (op.propName === "parent") {
            const destCategory = await Category.findById(op.value);
            if (!destCategory) {
                return res.status(400).json({ message: "move destination is invalid" });
            }
            else if (destCategory.user && destCategory.user != req.user.id) {
                return res.status(401).json({ message: "move destination is unauthorised" });
            }
        }

        // Only moderators can unlock categories
        if (op.propName === "locked" && op.value === false) {
            const user = await User.find({ _id: req.user.id, roles: "moderator" });

            if (user.length < 1) { // If there are no matching users who are moderators
                return res.status(401).json({ message: "unauthorised" });
            }
        }
    }

    // Get category
    let category;
    try {
        category = await Category.findById(req.params.categoryId);
    } catch (error) {
        return res.status(500).json({ error });
    }

    // Check it exists
    if (!category) {
        return res.status(404).json({ message: `No valid category found with id '${req.params.categoryId}'` });
    }

    // Update if authorised
    if (!category.user || category.user == req.user.id) {
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
    return res.status(200).json({ updatedCategory });
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
    } else if (category.user && category.user != req.user.id) {
        return res.status(404).json({ message: "unauthorised" });
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