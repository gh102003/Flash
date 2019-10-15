require("dotenv").config();
const https = require("https");
const fs = require("fs");
const app = require("./app");

const port = process.env.PORT || 3444;

const server = https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/flashapp.uk.to/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/flashapp.uk.to/fullchain.pem")
}, app); // Set express app as request handler

server.listen(port);