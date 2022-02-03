import { db, getMessage, Ticket } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'mostrar',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: ({ interaction }) => {
		const { locale, guildId, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let {
			transcriptId,
			categoryId,
			categories,
			messageId,
			channelId,
			rolesId,
		} = ticket;

		if (!messageId) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'NO_TICKET')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let messageUrl = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;

		let eShow = new SLEmbed()
			.setSuccess('Ticket Info', user.tag)
			.setDescription(
				`${getMessage(locale, 'ticket', 'SHOW', {
					TRANSCRIPT: `<#${transcriptId}>`,
					CATEGORY: `<#${categoryId}>`,
					CHANNEL: `<#${channelId}>`,
					URL: messageUrl,
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
