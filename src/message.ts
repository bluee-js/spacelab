import { Client, Message, TextChannel } from 'discord.js';
import messages from './messages.json';

function getMessage(
	language: string,
	indexName: string,
	indexMessage?: string,
	keys?: { [key: string]: string | number }
) {
	language = language === 'pt-BR' ? 'pt-br' : 'en-us';
	let message: string = messages[indexName];
	message = indexMessage ? message[indexMessage][language] : message[language];

	for (let key in keys || {}) {
		message = message.replaceAll(`{${key}}`, keys[key].toString());
	}

	return message;
}

async function fetchMessage(
	channelId: string,
	messageId: string,
	client: Client
): Promise<Message | null> {
	try {
		let channel = (await client.channels.fetch(channelId)) as TextChannel;
		let message = await channel.messages.fetch(messageId);

		return message;
	} catch {
		return null;
	}
}

export { getMessage, fetchMessage };
