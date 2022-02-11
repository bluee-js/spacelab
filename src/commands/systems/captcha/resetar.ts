import { get, del, getMessage, fetchMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'resetar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let captcha = get('c');
		let { messageId, channelId } = captcha;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new Embed().setError(getMessage(locale, 'captcha', 'NO'));
			interaction.editReply({ embeds: [eError] });
			return;
		}

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'captcha', 'RESET')
		);

		await del('c');
		if (message) await message.delete();
		interaction.editReply({ embeds: [eSuccess] });
	},
});
