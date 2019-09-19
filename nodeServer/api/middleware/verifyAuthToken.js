const express = require("express");
const jwt = require("jsonwebtoken");

const credentials = require("../../credentials");

module.exports = (req, res, next) => {
    req.user = {
        id: null
    };
    const authHeader = req.header("Authorization");
    if (authHeader) {
        try {
            req.user = jwt.verify(authHeader.split("Bearer ")[1], credentials.jwt.privateKey);
        } catch (error) {
            return res.status(401).json({ message: "Auth failed - Invalid or expired token" }); // If failed, delete auth token
        }
    }
    next();
};