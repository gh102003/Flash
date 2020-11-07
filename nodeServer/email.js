const nodemailer = require("nodemailer");
const credentials = require("./credentials");

let transport;

const connect = retry => {
    transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: credentials.gmail.auth,
        disableFileAccess: true,
        disableUrlAccess: true,
        dkim: {
            domainName: "flash-app.co.uk",
            keySelector: credentials.dkim.selector,
            privateKey: credentials.dkim.privateKey
        }
    });

    transport.verify((error, success) => {
        if (error) {
            if (retry) {
                console.error("Email server connection failed, retrying in 2 seconds...");
                console.error(error);
                setTimeout(() => connect(false), 2000);
            } else {
                console.error("Email server connection failed");
                console.error(error);
                process.exit(1);
            }
        } else {
            console.log("Email server connection successful");
        }
    });
};

connect(true);

module.exports = transport;