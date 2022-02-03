import {
	TextChannel,
	MessageEmbed,
	CategoryChannel,
	MessageActionRow,
	MessageSelectMenu,
} from 'discord.js';

import { db, getMessage, Ticket } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'canal',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ interaction, options }) => {
		await interaction.deferReply();

		const { guild, locale, user } = interaction;

		let transcript = options.getChannel('transcritos') as TextChannel;
		let category = options.getChannel('categoria') as CategoryChannel;
		let channel = options.getChannel('canal_de_texto') as TextChannel;
		let ticket = (db.get('ticket') || {}) as Ticket;

		let { embed, categories, messageId, channelId } = ticket;

		if (messageId) {
			let oldChannel = guild.channels.cache.get(channelId) as TextChannel;
			oldChannel.messages.cache.get(messageId)?.delete();
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'CHANNEL', { CHANNEL: channel.name }),
			user.tag
		);

		let eTicket = new MessageEmbed(
			embed ?? {
				description:
					'Selecione uma categoria abaixo para abrir um ticket.\n*Select a category above to open a ticket.*',
				color: 'BLURPLE',
				title: 'Ticket',
			}
		);

		let rTicket = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder('Categories...')
				.setCustomId('ticket')
				.setMaxValues(1)
				.addOptions(
					categories
						? categories.map((c) => ({
								label: c.label,
								value: c.label,
								emoji: c.emoji,
						  }))
						: [{ label: 'None', value: 'None' }]
				)
		);

		if (!categories) rTicket.components[0].setDisabled(true);

		ticket.messageId = (
			await channel.send({
				components: [rTicket],
				embeds: [eTicket],
			})
		).id;

		ticket.transcriptId = transcript.id;
		ticket.categoryId = category.id;
		ticket.channelId = channel.id;

		await db.set('ticket', ticket);
		await db.save();

		await interaction.editReply({ embeds: [eSuccess] });
	},
});
