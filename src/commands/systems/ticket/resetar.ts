import { db, fetchMessage, getMessage, Ticket } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction }) => {
		const { locale, guild, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let { messageId, channelId } = ticket;

		if (!messageId) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'NO_TICKET')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let message = await fetchMessage(channelId, messageId, client);

		if (message) await message.delete();
		await db.delete('ticket');
		await db.save();

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'RESET'),
			user.tag
		);

		interaction.reply({ embeds: [eSuccess] });
	},
});
