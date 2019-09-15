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
            console.error(error);
            return res.status(401).json({ error: "Auth failed" }); // If failed, delete auth token
        }
    }
    next();
};