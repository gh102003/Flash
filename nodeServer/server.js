require("dotenv").config();
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3001;

//const server = http.createServer(app); // Set express app as request handler

app.listen(port); // Use app to listen to enable HTTPS