import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { db, fetchMessage, getMessage, Ticket } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'categorias',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		const { locale, guild, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let { messageId, channelId } = ticket;

		let message = await fetchMessage(channelId, messageId, client);

		let categoriesArray = options.data[0].options.map(
			(o) => o.value
		) as string[];

		ticket.categories = categoriesArray.map((c) => {
			let [label, emoji] = c.split(';').map((c) => c.trim());
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
					})) || [{ label: 'None', value: 'None' }]
				)
		);

		if (message) message.edit({ components: [rTicket] });

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'CATEGORY', {
				QUANTITY: ticket.categories.length,
			}),
			user.tag
		);

		await db.set('ticket', ticket);
		await db.save();

		interaction.reply({ embeds: [eSuccess] });
	},
});
