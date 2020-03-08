const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

/**
 * @param {string} templatePath a file path from "nodeServer/templates/";
 * @returns a Handlebars template ready to call with context (params object)
 */
const compileTemplate = templatePath => {
    const templateFile = fs.readFileSync(path.join(__dirname, "templates", templatePath), { encoding: "utf8" });
    const template = Handlebars.compile(templateFile);
    console.log("Loaded template at '" + templatePath + "'");
    
    return template;
};

module.exports = compileTemplate;