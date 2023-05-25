const fs = require('node:fs');
const { Client, GatewayIntentBits, EmbedBuilder, Collection, ActivityType } = require(`discord.js`);
const { Player } = require('discord-player');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] }); 

client.commands = new Collection();

const player = new Player(client);

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Сейчас играет ${track.author} - ${track.title}`);
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login(token)
	await player.extractors.loadDefault();
})();