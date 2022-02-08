import { getMessage, Embed } from '../..';
import { Command } from 'sl-commands';
import { Message } from 'discord.js';

export default new Command({
	name: 'ping',
	type: 'CHAT_INPUT',
	description: "Shows my and API's ping",
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		interaction
			.deferReply({ fetchReply: true })
			.then(({ createdTimestamp }: Message) => {
				let msBot = Date.now() - createdTimestamp;
				let msApi = client.ws.ping;

				let ePing = new Embed().setDescription(
					getMessage(locale, 'ping', null, { BOT_MS: msBot, API_MS: msApi })
				);

				interaction.editReply({ embeds: [ePing] });
			});
	},
});
