import { REST, Routes } from 'discord.js';

import { config } from 'dotenv';
config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_APP_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// NOTE: THIS SCRIPT DELETES ALL COMMANDS IN THE GUILD AND GLOBAL SCOPE
const rest = new REST().setToken(TOKEN);

// for guild-based commands
rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
  .then(() => console.log('Successfully deleted all guild commands.'))
  .catch(console.error);

// for global commands
rest
  .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);
