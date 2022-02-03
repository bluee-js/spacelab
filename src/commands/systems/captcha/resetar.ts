import { Captcha, db, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';
import { TextChannel } from 'discord.js';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ interaction }) => {
		const { locale, guild, user } = interaction;

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

		await message.delete().catch(() => null);
		db.delete('captcha');
		db.save();

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'captcha', 'RESET'),
			user.tag
		);

		interaction.reply({ embeds: [eSuccess] });
	},
});
