import { db, get, save, getMessage, fetchMessage } from '../../..';
import { MessageEmbedOptions } from 'discord.js';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'embed',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let captcha = get(db, 'c');
		let { messageId, channelId } = captcha;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new SLEmbed().setError(getMessage(locale, 'captcha', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		captcha.embed = {
			color: options.getString('cor'),
			title: options.getString('título'),
			image: options.getString('imagem'),
			description: options.getString('descrição'),
		};

		if (message) {
			try {
				await message.edit({ embeds: [captcha.embed as MessageEmbedOptions] });
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
			getMessage(locale, 'captcha', 'EMBED')
		);

		await save(db, captcha);
		interaction.reply({ embeds: [eSuccess] });
	},
});
