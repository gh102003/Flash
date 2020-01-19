const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Category = require("../models/category");
const credentials = require("../../credentials");

const verifyAuthToken = require("../middleware/verifyAuthToken");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    // Check for existing user with same name
    let existingUser;
    try {
        existingUser = await User.findOne({ username: req.body.username }); // Check if username already exists
    } catch (_) { // If there's no user
        void (0);
    }
    if (existingUser) {
        return res.status(409).json({ error: "Username already taken" });
    }

    // Check for existing user with same email
    let existingEmailAddress;
    try {
        existingEmailAddress = await User.findOne({ emailAddress: req.body.emailAddress }); // Check if username already exists
    } catch (_) { // If there's no user
        void (0);
    }
    if (existingEmailAddress) {
        return res.status(409).json({ error: "Email address already taken" }); // 409 Conflict
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10); // Encrypt

    let user;
    try {
        // Create a new user
        user = new User({
            username: req.body.username,
            emailAddress: req.body.emailAddress,
            encryptedPassword
        });
        await user.save();
    }
    catch (error) {
        return res.status(400).json({ error: "Malformed user data" }); // 409 Conflict
    }

    // Create a new 'home' category for the new user
    const homeCategory = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.username + "'s home",
        colour: 14423100,
        user: user._id
    });
    await homeCategory.save();

    // Send response
    res.status(201).json({
        createdUser: {
            id: user._id,
            username: user.username,
            emailAddress: user.emailAddress,
            subscriptionLevel: user.subscriptionLevel,
            homeCategory
        }
    });

});

router.post("/login", (req, res, next) => {
    const handleAuthFail = message => {
        console.log(message);
        res.status(401).json({ error: "Auth failed" }); // Send non-specific error message to prevent attacks
    };

    let user;

    User.findOne({ emailAddress: req.body.emailAddress }) // Find user
        .then(foundUser => {
            user = foundUser;
            if (!foundUser) {
                throw new Error("User not found");
            } else {
                return bcrypt.compare(req.body.password, foundUser.encryptedPassword);
            }
        })
        .then(isPasswordCorrect => {
            if (isPasswordCorrect) {
                // Create a JSON Web Token
                const token = jwt.sign(
                    // Send payload (claims made by the client)
                    {
                        username: user.username,
                        emailAddress: user.emailAddress,
                        id: user.id
                    },
                    credentials.jwt.privateKey,
                    {
                        expiresIn: "1h"
                    }
                );

                // Send token to client, which will be used to access resources
                return res.status(200).json({
                    message: "Auth successful",
                    token
                });
            } else {
                handleAuthFail("Incorrect password");
            }
        })
        .catch(handleAuthFail);
});

router.get("/:userId", verifyAuthToken, async (req, res, next) => {
    if (req.params.userId === req.user.id) {
        const user = await User.findById(req.params.userId).select("-encryptedPassword");
        if (!user) res.status(404).json({ message: `No user found for id ${req.params.userId}` });
        res.status(200).json(user);
    } else {
        return res.status(401).json({ message: "unauthorised" });
    }
});

router.patch("/:userId", verifyAuthToken, async (req, res, next) => {
    if (req.params.userId === req.user.id) {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ message: `No user found for id ${req.params.userId}` });
        }

        let updateOps = {};
        // Use for...of loop to support async/await properly
        for (const op of req.body) {
            if (op.propName === "profilePicture") {
                // Use $set operation type
                updateOps["$set"] = {
                    ...updateOps.$set,
                    [op.propName]: op.value
                };
            } else {
                return res.status(400).json({ message: "only profile picture can be changed" });
            }
        }

        // Update database
        await user.update(updateOps);
        // Get new details and send in response
        const updatedUser = await User.findById(req.params.userId).select("-encryptedPassword");
        res.status(200).json({ updatedUser });
    } else {
        return res.status(401).json({ message: "unauthorised" });
    }
});

//router.delete("/:userId", (req, res, next) => {
//     User.findByIdAndDelete(req.params.userId)
//         .then(deletedUser => {
//             if (deletedUser) {
//                 res.status(200).json({ deletedUser: { ...deletedUser.toJSON(), encryptedPassword: undefined } }); // Send without encrypted password
//             } else {
//                 res.status(404).json({ error: "Not found" });
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ error });
//         });
// });

module.exports = router;