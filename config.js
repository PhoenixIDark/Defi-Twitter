var env = process.env.NODE_ENV || "development";
var settings = require("./settings.json")[env];

module.exports = {
    env: env,
    port: process.env.PORT || 8080,
    requirejsCommand: settings.requirejsCommand
};
