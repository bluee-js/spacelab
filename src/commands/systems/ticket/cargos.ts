import { get, save, fetchMessage, getMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'cargos',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let ticket = get('t');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new Embed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		ticket.rolesId = options.data[0].options.map((o) => o.value as string);

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'ticket', 'ROLES')
		);

		await save(ticket);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
