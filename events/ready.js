const { Activity, ActivityType } = require("discord.js");
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("\x1b[33m", 'Ready!', "\x1b[37m");
    },
};