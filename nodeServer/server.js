require("dotenv").config();
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 81;

const server = http.createServer(app); // Set express app as request handler

server.listen(port);