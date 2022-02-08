import { get, save, getMessage, fetchMessage, Embed } from '../../..';
import { MessageEmbedOptions } from 'discord.js';
import { Command } from 'sl-commands';

export default new Command({
	name: 'embed',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let captcha = get('c');
		let { messageId, channelId } = captcha;
		let message = await fetchMessage(channelId, messageId, client);

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
				let eError: Embed;

				if (e.code === 50035) {
					eError = new Embed().setError(getMessage(locale, 'invalid_image'));
				} else {
					eError = new Embed().setError(getMessage(locale, 'unknown_error'));
				}

				interaction.editReply({ embeds: [eError] });
				return;
			}
		}

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'captcha', 'EMBED')
		);

		await save(captcha);
		interaction.reply({ embeds: [eSuccess] });
	},
});
