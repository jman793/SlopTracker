import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription('Gets the link and endrsements of a game by the name.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the game.')
        .setRequired(true),
    ),
  async execute(interaction, dao) {
    const game = await dao.findGameByName(
      interaction.options.getString('name'),
    );
    if (!game) {
      await interaction.reply(
        `No game found with the name "${interaction.options.getString('name')}"`,
      );
      return;
    }
    await interaction.reply(
      `Link for ${game.name}:\n\n${game.link}\n\nEndorsements: ${game.endorsements}\n\nOwners: ${game.owners}`,
    );
  },
};
