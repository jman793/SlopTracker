import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes a game from the slop list.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the game.')
        .setRequired(true),
    ),
  async execute(interaction, dao) {
    interaction.reply('This command is not yet implemented.');
    return;
    // const name = interaction.options.getString('name');
    // try {
    //   await dao.removeGame(name);
    //   interaction.reply(`Removed ${name}.`);
    // } catch (error) {
    //   console.error(error);
    //   interaction.reply(`Error removing game.`);
    // }
    // return;
  },
};
