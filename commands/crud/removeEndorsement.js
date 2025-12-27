import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes an endorsement from the game.')
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
          'The username of whos endorsement you are removing. Default is you.',
        )
        .setRequired(false),
    ),
  async execute(interaction, dao) {
    const name = interaction.options.getString('name');
    const who = interaction.options.getUser('who') || interaction.user;
    await dao.removeEndorsement(name, who.username);
    interaction.reply(`User ${who} removed endorsement from ${name}.`);
    return;
  },
};
