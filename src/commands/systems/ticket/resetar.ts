import { get, del, fetchMessage, getMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let ticket = get('t');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new Embed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.editReply({ embeds: [eError] });
			return;
		}

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'ticket', 'RESET')
		);

		await del('t');
		if (message) await message.delete();
		interaction.editReply({ embeds: [eSuccess] });
	},
});
