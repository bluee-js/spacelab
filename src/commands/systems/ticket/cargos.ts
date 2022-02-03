import { db, fetchMessage, getMessage, Ticket } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'cargos',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		const { locale, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let { messageId, channelId } = ticket;

		if (!(await fetchMessage(channelId, messageId, client))) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'NO_TICKET')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'ROLES'),
			user.tag
		);

		ticket.rolesId = options.data[0].options.map((o) => o.value as string);

		db.set('ticket', ticket);
		db.save();

		interaction.reply({ embeds: [eSuccess] });
	},
});
