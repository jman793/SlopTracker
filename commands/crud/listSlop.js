import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lists all the games we have stored.'),
  async execute(interaction, dao) {
    const data = await dao.readStateFile();
    const names = data.map((game) => game.name);
    await interaction.reply(`List of Slop Games:\n ${names.join('\n')}`);
  },
};
