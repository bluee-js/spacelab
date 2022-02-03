import { db, get, save, fetchMessage, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'cargos',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
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

		ticket.rolesId = options.data[0].options.map((o) => o.value as string);

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'ROLES')
		);

		await save(db, ticket);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
