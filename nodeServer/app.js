const express = require("express"); // Framework
const morgan = require("morgan"); // Logging
const bodyParser = require("body-parser"); // Body parsing
const mongoose = require("mongoose"); // MongoDB

const categoryRoutes = require("./api/routes/categories");
const flashcardRoutes = require("./api/routes/flashcards");
const mongoAtlasConfig = require("./mongoAtlas");

const app = express();

// Connect to Mongo Atlas database
const mongoUrl = `mongodb+srv://${mongoAtlasConfig.credentials.username}:${mongoAtlasConfig.credentials.password}@flashcluster-nquld.mongodb.net/flash-database?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true });

// Logging middleware
app.use(morgan("dev"));


// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
})); // URL encoded (query string)
app.use(bodyParser.json()); // JSON

// Fix CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Setup routers (middleware)
app.use("/categories", categoryRoutes);
app.use("/flashcards", flashcardRoutes);

// Error handling - anything else
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Export from module
module.exports = app;