import { get, fetchMessage, getMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		let captcha = get('c');
		let { messageId, channelId, rolesId } = captcha;

		if (!messageId) {
			let eError = new Embed().setError(getMessage(locale, 'captcha', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let message = await fetchMessage(channelId, messageId, client);
		let eShow = new Embed().setSuccess('Captcha Info').setDescription(
			`${getMessage(locale, 'captcha', 'SHOW', {
				CHANNEL: `<#${channelId}>`,
				URL: message.url,
			})}${
				rolesId
					? getMessage(locale, 'captcha', 'SHOW_ROLES', {
							ADD_ROLE: `<@&${rolesId.add[0]}>`,
							REM_ROLE: `<@&${rolesId.remove[0]}>`,
					  })
					: ''
			}`
		);

		interaction.reply({ embeds: [eShow] });
	},
});
