import { Client, Message, TextChannel } from 'discord.js';
import messages from './messages.json';
import { Captcha, Ticket } from '.';
import { Database } from 'simpl.db';

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
		message = message.replaceAll(`{${key}}`, keys[key].toString());
	}

	return message;
}

function get(db: Database, type: 't'): Ticket;
function get(db: Database, type: 'c'): Captcha;
function get(db: Database, type: 't' | 'c'): Ticket | Captcha {
	return (db.get(type) || {}) as Ticket | Captcha;
}

async function del(db: Database, type: 't' | 'c') {
	let ref = { t: 'ticket', c: 'captcha' };

	await db.delete(ref[type]);
	await db.save();
}

async function save(db: Database, ticketOrCaptcha: Ticket | Captcha) {
	let ref: string;
	
	if ('transcriptId' in ticketOrCaptcha) ref = 'ticket';
	else ref = 'captcha';

	await db.set(ref, ticketOrCaptcha);
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

export { getMessage, fetchMessage, save, del, get };
