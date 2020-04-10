const express = require("express");

const courseRoutes = require("./courses");
const sectionRoutes = require("./sections");
const topicRoutes = require("./topics");

const router = express.Router();

router.use("/courses", courseRoutes);
router.use("/sections", sectionRoutes);
router.use("/topics", topicRoutes);

module.exports = router;