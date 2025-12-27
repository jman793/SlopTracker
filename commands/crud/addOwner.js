import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('owner')
    .setDescription('Adds a owner to the game.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the game.')
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName('who')
        .setDescription(
          'The username of who is endorsing the game. Default is you.',
        )
        .setRequired(false),
    ),
  async execute(interaction, dao) {
    const name = interaction.options.getString('name');
    const who = interaction.options.getUser('who') || interaction.user;
    await dao.addOwner(name, who.username);
    interaction.reply(`User ${who} marked as owner for ${name}.`);
    return;
  },
};
