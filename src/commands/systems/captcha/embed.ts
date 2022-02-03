import { MessageEmbedOptions, TextChannel } from 'discord.js';
import { Captcha, getMessage, db } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'embed',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ interaction, options }) => {
		const { guild, locale, user } = interaction;

		let captcha = (db.get('captcha') || {}) as Captcha;
		let { messageId, channelId } = captcha;

		if (!messageId) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'captcha', 'NO_CAPTCHA')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let channel = guild.channels.cache.get(channelId) as TextChannel;
		let message = channel.messages.cache.get(messageId);

		if (!channel || !message) {
			db.delete('captcha');

			let eError = new SLEmbed().setError(
				getMessage(locale, 'captcha', 'NO_CAPTCHA')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		captcha.embed = {
			color: options.getString('cor'),
			title: options.getString('título'),
			image: options.getString('imagem'),
			description: options.getString('descrição'),
		};

		try {
			await message.edit({ embeds: [captcha.embed as MessageEmbedOptions] });
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

		db.set('captcha', captcha);
		db.save();

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'captcha', 'EMBED'),
			user.tag
		);

		interaction.reply({ embeds: [eSuccess] });
	},
});
