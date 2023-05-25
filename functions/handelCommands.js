const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { token } = require('../config.json');
const { clientId } = require('../config.json');

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(token);

        (async () => {
            try {
                console.log('')
                console.log("\x1b[35m", 'Started refreshing application (/) commands.');
                console.log('')

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log("\x1b[32m", 'Successfully reloaded application (/) commands.');
                console.log('')
            } catch (error) {
                console.error(error);
            }
        })();
    };
};