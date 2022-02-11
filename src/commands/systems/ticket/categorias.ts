import { get, save, fetchMessage, getMessage, Embed } from '../../..';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { Command } from 'sl-commands';

export default new Command({
	name: 'categorias',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let ticket = get('t');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		ticket.categories = options.data[0].options.map((o) => {
			let [label, emoji] = (o.value as string).split(';').map((c) => c.trim());
			return { label, emoji };
		});

		let rTicket = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder('Categories...')
				.setCustomId('ticket')
				.setMaxValues(1)
				.addOptions(
					ticket.categories.map((c) => ({
						label: c.label,
						value: c.label,
						emoji: c.emoji,
					}))
				)
		);

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'ticket', 'CATEGORY', {
				QUANTITY: ticket.categories.length,
			})
		);

		await save(ticket, 't');
		interaction.editReply({ embeds: [eSuccess] });
		if (message) message.edit({ components: [rTicket] });
	},
});
