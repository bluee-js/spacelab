import {
	MessageEmbedOptions,
	MessageSelectMenu,
	MessageActionRow,
	CategoryChannel,
	MessageEmbed,
	TextChannel,
} from 'discord.js';

import { get, save, fetchMessage, getMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'canal',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let channel = options.getChannel('canal_de_texto') as TextChannel;
		let category = options.getChannel('categoria') as CategoryChannel;
		let transcript = options.getChannel('transcritos') as TextChannel;

		let ticket = get('t');
		let { embed, categories, messageId, channelId } = ticket;
		(await fetchMessage(channelId, messageId, client))?.delete();

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'ticket', 'CHANNEL', { CHANNEL: channel.name })
		);

		let eTicket = new MessageEmbed(
			(embed ?? {
				description:
					'Selecione uma categoria abaixo para abrir um ticket.\n*Select a category above to open a ticket.*',
				color: 'BLURPLE',
				title: 'Ticket',
			}) as MessageEmbedOptions
		);

		let rTicket = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder('Categorias...')
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

		if (!categories) {
			rTicket.components[0].setDisabled(true);
		}

		ticket.transcriptId = transcript.id;
		ticket.categoryId = category.id;
		ticket.channelId = channel.id;
		ticket.messageId = (
			await channel.send({
				components: [rTicket],
				embeds: [eTicket],
			})
		).id;

		await save(ticket);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
