# SlopTracker

Discord bot that tracks slop with your friends

##  Slash Commands

### `endorse`

Adds a new endorsement to the game.

**Parameters**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | The name of the game. | true |
| who | user | The username of who is endorsing the game. Default is you. | false |

### `owner`

Adds a owner to the game.

**Parameters**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | The name of the game. | true |
| who | user | The username of who is endorsing the game. Default is you. | false |

### `add`

Adds a new game to the slop list.

**Parameters**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | The name of the game. | true |
| link | string | The link to the game. | true |

### `get`

Gets the link and endrsements of a game by the name.

**Parameters**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | The name of the game. | true |

### `list`

Lists all the games we have stored.

### `remove`

Removes an endorsement from the game.

**Parameters**

| Name | Type   | Description                                                        | Required |
| ---- | ------ | ------------------------------------------------------------------ | -------- |
| name | string | The name of the game.                                              | true     |
| who  | user   | The username of whos endorsement you are removing. Default is you. | false    |

### `help`

Provides information about the bot.

## Setup

1. Clone the repo
2. Create data file at desired file path 
	1. touch ./dataFile.json
3. Create .env file with the following format:
	DISCORD_GUILD_ID=${GUILD_ID}
	DISCORD_CLIENT_ID=${CLIENT_ID}
	DISCORD_TOKEN=${TOKEN}
	GAMES_FILE_PATH=${FILEPATH} (./dataFile.json)
4. Run `npm install`
5. Run `npm run start`

