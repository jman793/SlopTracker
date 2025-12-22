import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides information about the bot.'),
  async execute(interaction) {
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
    );
  },
};
