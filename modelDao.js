import { readFile, writeFile } from 'fs/promises';
import { MAX_OWNERS, MAX_ENDORSEMENTS } from './constants.js';

import { calculateOwnership } from './suggestion.js';

const MAX_GAMES = 1000;

export class SlopGameModelDao {
  filePath;
  logger;

  constructor(filePath, logger) {
    this.filePath = filePath;
    this.logger = logger;
  }

  async readStateFile() {
    const data = await this.readRawFile(this.filePath);
    const jsonObject = JSON.parse(data); // Parse the string content into an object
    return jsonObject.games;
  }

  async readRawFile(filePath) {
    return await readFile(filePath, 'utf8');
  }

  async appendStateFile(game) {
    const data = await this.readRawFile(this.filePath);
    const jsonObject = JSON.parse(data);
    if (jsonObject.games.length >= MAX_GAMES) {
      throw new Error('Max games reached');
    }

    if (
      jsonObject.games.find(
        (objGame) => objGame.name.toLowerCase() === game.name.toLowerCase(),
      )
    ) {
      const index = jsonObject.games.findIndex(
        (objGame) => objGame.name.toLowerCase() === game.name.toLowerCase(),
      );
      jsonObject.games[index] = game;
    } else {
      jsonObject.games.push(game);
    }

    await writeFile(this.filePath, JSON.stringify(jsonObject), 'utf8'); // Write the string to the file
  }

  async findGameByName(name) {
    const data = await this.readStateFile();
    const game = data.find(
      (game) => game.name.toLowerCase() === name.toLowerCase(),
    );
    return game;
  }

  // Returns games sorted by percentage of ownership
  // If no owners it just passes in the most owned games
  async findGamesByOwnerList(owners) {
    const games = await this.readStateFile();
    const sanitzedOwners = owners || [];
    if (!owners || owners.length === 0) {
      this.logger.info('No owners passed in');
      return games.sort((a, b) => {
        return b.owners.length - a.owners.length;
      });
    }
    return games
      .sort(
        (a, b) =>
          calculateOwnership(a, sanitzedOwners) -
          calculateOwnership(b, sanitzedOwners),
      )
      .reverse();
  }

  async addEndorsement(gameName, user) {
    const game = await this.findGameByName(gameName);
    if (!game) {
      throw new Error(`Game gameName not found`);
    }

    const gameEndorsements = game.endorsements;
    if (!gameEndorsements) {
      game.endorsements = [user];
    } else if (gameEndorsements.length >= MAX_ENDORSEMENTS) {
      throw new Error('Max endorsements reached');
    } else if (gameEndorsements.includes(user)) {
      this.logger.warn(`User ${user} already endorsed ${gameName}`);
      return;
    } else {
      game.endorsements.push(user);
      this.logger.warn(`User ${user} endorsed ${gameName}`);
    }
    await this.appendStateFile(game);
  }

  async removeEndorsement(gameName, user) {
    const game = await this.findGameByName(gameName);
    if (!game) {
      throw new Error(`Game gameName not found`);
    }

    const gameEndorsements = game.endorsements;
    if (!gameEndorsements) {
      throw new Error(`Game ${gameName} has no endorsements`);
    }

    const index = gameEndorsements.indexOf(user);
    if (index === -1) {
      throw new Error(`User ${user} is not endorsed by ${gameName}`);
    }

    gameEndorsements.splice(index, 1);
    await this.appendStateFile(game);
  }

  async addOwner(gameName, user) {
    const game = await this.findGameByName(gameName);
    if (!game) {
      throw new Error(`Game gameName not found`);
    }

    const gameOwners = game.owners;
    if (!gameOwners) {
      game.owners = [user];
    } else if (gameOwners.length >= MAX_OWNERS) {
      throw new Error('Max owners reached');
    } else if (gameOwners.includes(user)) {
      this.logger.warn(`User ${user} already owns ${gameName}`);
      return;
    } else {
      game.owners.push(user);
      this.logger.info(`User ${user} owns ${gameName}`);
    }
    await this.appendStateFile(game);
  }
}
