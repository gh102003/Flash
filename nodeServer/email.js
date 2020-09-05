const nodemailer = require("nodemailer");
const credentials = require("./credentials");

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: credentials.gmail.auth,
    dkim: {
        domainName: "flash-app.co.uk",
        keySelector: credentials.dkim.selector,
        privateKey: credentials.dkim.privateKey
    }
});

transport.verify(function (error, success) {
    if (error) {
        console.error("Email server connection failed");
        console.error(error);
    } else {
        console.log("Email server connection successful");
    }
});

module.exports = transport;