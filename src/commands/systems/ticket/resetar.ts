import { db, get, del, fetchMessage, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let ticket = get(db, 't');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new SLEmbed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'RESET')
		);

		await del(db, 't');
		if (message) await message.delete();
		interaction.reply({ embeds: [eSuccess] });
	},
});
