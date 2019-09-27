const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Category = require("../models/category");
const credentials = require("../../credentials");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    // Check for existing user with same name
    let existingUser;
    try {
        existingUser = await User.findOne({ username: req.body.username }); // Check if username already exists
    } catch (_) {
        void(0);
    }
    if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10); // Encrypt

    // Create a new user
    const user = new User({
        username: req.body.username,
        encryptedPassword
    });
    await user.save();

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

    User.findOne({ username: req.body.username }) // Find user
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

router.delete("/:userId", (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(200).json({ deletedUser: { ...deletedUser.toJSON(), encryptedPassword: undefined } }); // Send without encrypted password
            } else {
                res.status(404).json({ error: "Not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error });
        });
});

module.exports = router;