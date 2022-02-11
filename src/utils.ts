import { Client, Message, TextChannel } from 'discord.js';
import messages from './messages.json';
import { Captcha, Ticket } from '.';
import { Database } from 'simpl.db';

const db = new Database({
	collectionsFolder: 'collections',
	tabSize: 2,
});

function getMessage<
	T extends keyof typeof messages,
	U extends keyof typeof messages[T]
>(
	language: string,
	indexName: T,
	indexMessage?: U,
	keys?: { [key: string]: string | number }
) {
	language = language === 'pt-BR' ? 'pt-br' : 'en-us';
	let index = messages[indexName];

	let message: string = indexMessage
		? index[indexMessage][language]
		: index[language];

	for (let key in keys || {}) {
		message = message.replaceAll(`{${key}}`, `${keys[key]}`);
	}

	return message;
}

function get(type: 't'): Ticket;
function get(type: 'c'): Captcha;
function get(type: 't' | 'c'): Ticket | Captcha {
	let ref = { t: 'ticket', c: 'captcha' };

	return (db.get(ref[type]) || {}) as Captcha | Ticket;
}

async function del(type: 't' | 'c') {
	let ref = { t: 'ticket', c: 'captcha' };

	await db.delete(ref[type]);
	await db.save();
}

async function save(object: Ticket | Captcha, type: 't' | 'c') {
	let ref = { t: 'ticket', c: 'captcha' };

	await db.set(ref[type], object);
	await db.save();
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

export { getMessage, fetchMessage, save, del, get, db };
