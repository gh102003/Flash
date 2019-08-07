const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const credentials = require("../../credentials");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    User.findOne({ username: req.body.username }) // Check if username already exists
        .then(user => {
            if (user) {
                res.status(409).json({ error: "Username already exists" });
            } else {
                bcrypt.hash(req.body.password, 10) // Encrypt
                    .then(encryptedPassword => {
                        const user = new User({
                            username: req.body.username,
                            encryptedPassword
                        });
                        return user.save(); // Save to database
                    })
                    .then(user => {
                        res.status(201).json({
                            createdUser: {
                                id: user._id,
                                username: user.username
                            }
                        }); // Send response
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ error });
                    });
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
                        email: user.username,
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