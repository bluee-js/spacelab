import { db, fetchMessage, getMessage, Ticket } from '../../..';
import { MessageEmbedOptions } from 'discord.js';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'embed',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		const { locale, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let { messageId, channelId } = ticket;

		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'NO_TICKET')
			);

			db.delete('ticket');
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

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

				interaction.reply({ embeds: [eError], ephemeral: true });
				return;
			}
		}

		db.set('ticket', ticket);
		db.save();

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'EMBED'),
			user.tag
		);

		interaction.reply({ embeds: [eSuccess] });
	},
});
