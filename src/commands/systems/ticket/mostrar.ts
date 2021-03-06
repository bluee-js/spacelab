import { get, getMessage, fetchMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		let ticket = get('t');
		let {
			transcriptId,
			categoryId,
			categories,
			messageId,
			channelId,
			rolesId,
		} = ticket;

		if (!messageId) {
			let eError = new Embed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.editReply({ embeds: [eError] });
			return;
		}

		let message = await fetchMessage(channelId, messageId, client);
		let eShow = new Embed().setSuccess('Ticket Info').setDescription(
			`${getMessage(locale, 'ticket', 'SHOW', {
				TRANSCRIPT: `<#${transcriptId}>`,
				CATEGORY: `<#${categoryId}>`,
				CHANNEL: `<#${channelId}>`,
				URL: message.url,
			})}${
				rolesId
					? getMessage(locale, 'ticket', 'SHOW_ROLES', {
							ROLES: rolesId.map((id) => `<@&${id}>`).join(', '),
					  })
					: ''
			}${
				categories
					? getMessage(locale, 'ticket', 'SHOW_CATEGORIES', {
							CATEGORIES: categories
								.map((c) =>
									`${c.emoji ? `${c.emoji} **|**` : ''} ${c.label}`.trim()
								)
								.join('\n'),
					  })
					: ''
			}`
		);

		interaction.reply({ embeds: [eShow] });
	},
});
