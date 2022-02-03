import { db, get, fetchMessage, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		let captcha = get(db, 'c');
		let { messageId, channelId, rolesId } = captcha;

		if (!messageId) {
			let eError = new SLEmbed().setError(getMessage(locale, 'captcha', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let message = await fetchMessage(channelId, messageId, client);
		let eShow = new SLEmbed().setSuccess('Captcha Info').setDescription(
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
