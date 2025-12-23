import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds a new game to the slop list.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the game.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('link')
        .setDescription('The link to the game.')
        .setRequired(true),
    ),
  async execute(interaction, dao) {
    const urlFormat =
      /^(https?:\/\/)?store\.steampowered\.com\/(app|sub)\/(\d+|\w+)\/?/i;

    if (!urlFormat.test(interaction.options.getString('link'))) {
      interaction.reply('Invalid link.');
      return;
    }

    const game = {
      name: interaction.options.getString('name'),
      link: interaction.options.getString('link'),
      endorsements: [interaction.user.username],
    };
    await dao.appendStateFile(game);
    interaction.reply(`Added ${game.name} to the list.`);
  },
};
