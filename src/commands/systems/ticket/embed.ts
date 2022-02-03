import { db, get, save, fetchMessage, getMessage } from '../../..';
import { MessageEmbedOptions } from 'discord.js';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'embed',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let ticket = get(db, 't');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		ticket.embed = {
			color: options.getString('cor'),
			title: options.getString('título'),
			image: options.getString('imagem'),
			description: options.getString('descrição'),
		};

		if (message) {
			try {
				await message.edit({ embeds: [ticket.embed as MessageEmbedOptions] });
			} catch (e) {
				let eError: SLEmbed;

				if (e.code === 50035) {
					eError = new SLEmbed().setError(getMessage(locale, 'invalid_image'));
				} else {
					eError = new SLEmbed().setError(getMessage(locale, 'unknown_error'));
				}

				interaction.editReply({ embeds: [eError] });
				return;
			}
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'EMBED')
		);

		await save(db, ticket);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
