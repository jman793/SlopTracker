import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  MessageFlags,
} from 'discord.js';

import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { SlopGameModelDao } from './modelDao.js';

import { config } from 'dotenv';
config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_APP_ID;
const GAMES_FILE_PATH = process.env.GAMES_FILE_PATH;
const STAGE = process.env.STAGE;

const LOGGER = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.File({ filename: 'app.log' })],
});

if (STAGE !== 'prod') {
  LOGGER.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

const dao = new SlopGameModelDao(GAMES_FILE_PATH, LOGGER);

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
  ],
});

discordClient.on('ready', () => {
  LOGGER.info(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command.default && 'execute' in command.default) {
      discordClient.commands.set(command.default.data.name, command);
    } else {
      LOGGER.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

discordClient.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from bots
  if (message.content === 'ping') {
    message.channel.send('pong!');
    message.channel.send('https://steamcommunity.com/app/2827200');
    dao
      .readStateFile()
      .then((games) => message.channel.send(JSON.stringify(games[0].name)));
  }
  if (message.content === 'write') {
    const game = {
      id: 'LIARS_BAR_1',
      name: 'LIARS BAR',
      link: 'https://store.steampowered.com/app/3097560/Liars_Bar/',
    };
    try {
      dao
        .appendStateFile(game)
        .then(message.channel.send('wrote successfully'));
    } catch (error) {
      LOGGER.error('Error reading JSON file:', error);
    }
  }
});

discordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    LOGGER.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.default.execute(interaction, dao);
  } catch (error) {
    LOGGER.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

await discordClient.login(TOKEN);
