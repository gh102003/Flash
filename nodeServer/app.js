const path = require("path");
const express = require("express"); // Framework
const morgan = require("morgan"); // Logging
const bodyParser = require("body-parser"); // Body parsing
const mongoose = require("mongoose"); // MongoDB
const compression = require("compression");

const quizRoutes = require("./api/routes/quiz/");
const prioritiseRoutes = require("./api/routes/prioritise/");
const categoryRoutes = require("./api/routes/categories");
const flashcardRoutes = require("./api/routes/flashcards").router;
const tagRoutes = require("./api/routes/tags");
const userRoutes = require("./api/routes/users");
const billingRoutes = require("./api/routes/billing");

const credentials = require("./credentials");

const app = express();

// Connect to Mongo Atlas database
const mongoUrl = `mongodb+srv://${credentials.mongoAtlas.username}:${credentials.mongoAtlas.password}@flashcluster-nquld.mongodb.net/flash-database${process.env.NODE_ENV === "development" ? "-dev" : ""}?retryWrites=true&w=majority`;
try {
    mongoose.connect(mongoUrl, { useNewUrlParser: true });
} catch (error) {
    // Retry connection after 1 second if it fails (like it does with PM2 on startup)
    setTimeout(() => {
        try {
            mongoose.connect(mongoUrl, { useNewUrlParser: true });
        } catch (error) {
            process.exit(1);
        }
    }, 2000);
}
// mongoose.connection.on("error", () => mongoose.connect(mongoUrl, { useNewUrlParser: true }));

// GZIP compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("dev"));

// Fix CORS
app.use((req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
    }
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use("/static", express.static(path.join(__dirname, "static")));

// Before body parser because it does itself
app.use("/billing", billingRoutes);

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
})); // URL encoded (query string)
app.use(bodyParser.json()); // JSON

// Setup routers (middleware)
app.use("/quiz", quizRoutes);
app.use("/prioritise", prioritiseRoutes);
app.use("/categories", categoryRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/tags", tagRoutes);
app.use("/users", userRoutes);

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