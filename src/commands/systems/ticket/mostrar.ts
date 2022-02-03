import { db, get, getMessage, fetchMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction }) => {
		const { locale } = interaction;

		let ticket = get(db, 't');
		let {
			transcriptId,
			categoryId,
			categories,
			messageId,
			channelId,
			rolesId,
		} = ticket;

		if (!messageId) {
			let eError = new SLEmbed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let message = await fetchMessage(channelId, messageId, client);
		let eShow = new SLEmbed().setSuccess('Ticket Info').setDescription(
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
