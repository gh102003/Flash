require("dotenv").config();
const mongoose = require("mongoose");
const credentials = require("./credentials");

const User = require("./api/models/user");
const email = require("./email");

// Connect to Mongo Atlas database
const mongoUrl = `mongodb+srv://${credentials.mongoAtlas.username}:${credentials.mongoAtlas.password}@flashcluster-nquld.mongodb.net/flash-database${process.env.NODE_ENV === "development" ? "-dev" : ""}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true });

module.exports = (from, subject, template) => {
    User.find()
        .then(users => {
            users.forEach(user => {
                email.sendMail({
                    to: user.emailAddress,
                    from,
                    subject,
                    html: template({ username: user.username, emailAddress: user.emailAddress })
                }, (error, info, response) => {
                    if (error) {
                        console.error("Error sending email to", user.emailAddress);
                        console.error(error);
                    } else {
                        console.log("Successfully sent email to", user.emailAddress);
                    }
                });
            });
        });
};