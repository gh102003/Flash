require("dotenv").config();
const mongoose = require("mongoose");
const credentials = require("./credentials");

const User = require("./api/models/user");
const email = require("./email");

// Connect to Mongo Atlas database
const mongoUrl = `mongodb+srv://${credentials.mongoAtlas.username}:${credentials.mongoAtlas.password}@flashcluster-nquld.mongodb.net/flash-database${process.env.NODE_ENV === "development" ? "-dev" : ""}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true });

const sent = [
    "zidaneharper@gmail.com",
    "willmd69@icloud.com",
    "jjbuckmaster10@gmail.com",
    "009666@thurstoncollege.org",
    "bessydec@gmail.com",
    "hugothorneley99@hotmail.com",
    "rhyshudsy@gmail.com",
    "frazzybacon190@gmail.com",
    "bendjtheaker@gmail.com",
    "georgehowarth2003+test2@gmail.com",
    "hamishmiller43211@gmail.com",
    "009847@thurstoncollege.org",
    "andy.w.pointer@gmail.com",
    "GraceKnutton@Gmail.com",
    "george@pyesmeadow.com",
    "frasergipson@gmail.com",
    "010074@thurstoncollege.org",
    "georgehowarth2003+test5@gmail.com",
    "009697@thurstoncollege.org",
    "finleynicholas11@gmail.com",
    "georgehowarth2003+test4@gmail.com",
    "georgehowarth2003+test1@gmail.com",
    "alexandriad@live.co.uk",
    "009708@thurstoncollege.org",
    "finlay.welsh@icloud.com",
    "connorcrawford000@gmail.com",
    "fakeemail@gmail.com",
    "ronleggett10@gmail.com",
];

module.exports = async (from, subject, template) => {
    const users = await User.find();
    users
        .filter(user => !sent.includes(user.emailAddress))
        .forEach((user, index) => {
            setTimeout(() => email.sendMail({ // avoid rate limiting
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
            }), index * 2000);

        });
};