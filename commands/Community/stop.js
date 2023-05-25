const { SlashCommandBuilder, Client } = require('discord.js');
const { Player } = require('discord-player');

const client = new Client({
    intents: ['GuildVoiceStates']
});

const player = new Player(client)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('останавливает композицию'),

    async execute(interaction) {
        try {
            const queue = player.nodes.get(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'Нечего останавливать', ephemeral: true });
    
            queue.delete();
    
            return interaction.reply(`**Воспроизведение композиций прекращена!** By ${interaction.member.displayName}`);
        } catch (e) {
            return interaction.reply({ content: `Something went wrong: ${e}`, ephemeral: true });
        }
    }
    
}