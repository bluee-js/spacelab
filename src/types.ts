import {
	GuildMember,
	TextChannel,
	ButtonInteraction,
	CommandInteraction,
	SelectMenuInteraction,
} from 'discord.js';

export type Captcha = {
	rolesId: { add: string[]; remove: string[] };
	messageId: string;
	channelId: string;
	embed: {};
};

export type Ticket = {
	categories: { emoji?: string; label: string }[];
	transcriptId: string;
	categoryId: string;
	channelId: string;
	messageId: string;
	rolesId: string[];
	message: {};
	embed: {};
};

export type EInteraction<K extends 'BUTTON' | 'SELECT' | 'CHAT' = 'CHAT'> =
	(K extends 'BUTTON'
		? ButtonInteraction
		: K extends 'SELECT'
		? SelectMenuInteraction
		: CommandInteraction) & {
		channel: TextChannel;
		member: GuildMember;
	};
