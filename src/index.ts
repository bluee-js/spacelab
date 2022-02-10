import SLCommands from 'sl-commands';
import { Database } from 'simpl.db';
import { Client } from 'discord.js';
import { join } from 'path';
import 'dotenv/config';

const SL = new SLCommands(new Client({ intents: 14319 }), {
	commandsDir: join(__dirname, 'commands'),
	eventsDir: join(__dirname, 'events'),
	testServers: ['912780805770735637', '932471237328908359'],
	botOwners: '702529018410303640',
	botToken: process.env.botToken,
	showWarns: true,
	testOnly: true,
});

SL.on('commandException', (commandName, error) => {
	SL.logger.error(commandName, error);
});

export * from './utils';
export * from './types';
export * from './embed';
