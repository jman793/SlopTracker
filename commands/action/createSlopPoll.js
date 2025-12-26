import { SlashCommandBuilder, PollLayoutType, MessageFlags } from 'discord.js';
import { MAX_OWNERS } from '../../constants.js';

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a new poll to vote on a game.')
    .addStringOption((option) =>
      option
        .setName('owners')
        .setDescription('Comma separated list of owners..')
        .setRequired(false),
    ),
  async execute(interaction, dao) {
    const passedOwners = interaction.options.getString('owners');
    const owners = passedOwners
      ? passedOwners.replace(/\s/g, '').split(',')
      : [];

    if (owners.length > MAX_OWNERS) {
      interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `Max ${MAX_OWNERS} owners given.`,
      });
      return;
    }

    const ownedGames = await dao.findGamesByOwnerList(owners);

    // This limit is set by discord
    const MAX_POLL_OPTIONS = 10;
    const answers = ownedGames.slice(0, MAX_POLL_OPTIONS).map((game) => {
      return {
        text: `${game.name}: Owners: ${game.owners.length}`,
      };
    });
    if (answers.length === 0) {
      interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `No games found with owners ${owners}.`,
      });
      return;
    }
    try {
      interaction.channel.send({
        poll: {
          question: { text: 'Vote on slop games' },
          answers: answers,
          duration: 1,
          layoutType: PollLayoutType.Default,
        },
      });
      let ownersString = `Games: Owners: Endorsements:\n`;
      for (const game of ownedGames) {
        ownersString += `${game.name}: ${game.owners.join(', ') || 'No owners'}: ${game.endorsements.join(', ') || 'No Endorsements'}\n`;
      }
      await interaction.channel.send(ownersString);
      await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: 'Poll created.',
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        flags: MessageFlags.Ephemeral,
        content: `Error creating poll.`,
      });
    }
    return;
  },
};
