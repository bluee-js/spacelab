import { Captcha, db, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: ({ interaction }) => {
		const { locale, guildId, user } = interaction;

		let captcha = (db.get('captcha') || {}) as Captcha;
		let { messageId, channelId, rolesId } = captcha;

		if (!messageId) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'captcha', 'NO_CAPTCHA')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let messageUrl = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;

		let eShow = new SLEmbed()
			.setSuccess('Captcha Info', user.tag)
			.setDescription(
				`${getMessage(locale, 'captcha', 'SHOW', {
					CHANNEL: `<#${channelId}>`,
					URL: messageUrl,
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
