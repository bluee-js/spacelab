import { db, get, del, getMessage, fetchMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction }) => {
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

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'captcha', 'RESET')
		);

		await del(db, 'c');
		if (message) await message.delete();
		interaction.reply({ embeds: [eSuccess] });
	},
});
