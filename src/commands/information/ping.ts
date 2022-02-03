import { Command, SLEmbed } from 'sl-commands';
import { Message } from 'discord.js';
import { getMessage } from '../..';

export default new Command({
	name: 'ping',
	type: 'CHAT_INPUT',
	description: "Shows my and API's ping",
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		let eLoading = new SLEmbed().setLoading(getMessage(locale, 'loading'));
		let msApi = client.ws.ping;

		interaction
			.reply({ fetchReply: true, embeds: [eLoading] })
			.then(({ createdTimestamp }: Message) => {
				let msBot = Date.now() - createdTimestamp;

				let ePing = new SLEmbed().setDescription(
					getMessage(locale, 'ping', null, { BOT_MS: msBot, API_MS: msApi })
				);

				interaction.editReply({ embeds: [ePing] });
			});
	},
});
