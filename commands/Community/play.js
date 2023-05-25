const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const { Player } = require('discord-player');
const { YouTubeExtractor, SoundCloudExtractor, SpotifyExtractor, AppleMusicExtractor } = require('@discord-player/extractor');

const client = new Client({
    intents: ['GuildVoiceStates']
});

const player = new Player(client)

player.extractors.register(SpotifyExtractor, {});
player.extractors.register(SoundCloudExtractor, {});
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(AppleMusicExtractor, {});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Воспроизводит музыку из Youtube, SoundCloud, Spotify, Apple Music')
        .addStringOption(option =>
			option
				.setName('url')
				.setDescription('Ссылка или поиск композиции')
                .setRequired(true)
            ),
        async execute(interaction) {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true });
            const query = interaction.options.getString('url', true);
            await interaction.deferReply();

            const queue = player.nodes.create(interaction.guild, {
                metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,
            },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            });
                 
            try {
                const { track } = await player.play(channel, query, {
                    nodeOptions: {
                        metadata: interaction 
                    }
                });
                const queueEmbed = new EmbedBuilder()
	            .setColor(0x00FF00)
	            .setDescription(`✔️**Добавлено в очередь:** ${track.title}`)
                return interaction.followUp({embeds: [queueEmbed], ephemeral: true});
            } catch (e) {
        // let's return error if something failed
                return interaction.followUp({ content: `Something went wrong: ${e}`, ephemeral: true });
                }   
        

        }

        
};