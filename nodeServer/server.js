require("dotenv").config();
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3001;

app.listen(port); // Use app to listen to enable HTTPS and HTTP/2