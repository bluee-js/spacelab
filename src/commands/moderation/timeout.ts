import { Command, SLEmbed } from 'sl-commands';
import { GuildMember } from 'discord.js';
import { getMessage } from '../..';

export default new Command({
	name: 'timeout',
	type: 'CHAT_INPUT',
	description: 'Timeouts a member for a certain time',
	options: [
		{
			type: 'USER',
			name: 'member',
			description: 'Who you want to timeout',
			required: true,
		},
		{
			name: 'time',
			type: 'NUMBER',
			description: 'The timeout duration',
			required: true,
			minValue: 1,
		},
		{
			name: 'unit',
			type: 'NUMBER',
			description: 'The unit of the duration you gave',
			required: true,
			choices: [
				{ name: 'Minute(s)', value: 60000 },
				{ name: 'Hour(s)', value: 60 * 60000 },
				{ name: 'Day(s)', value: 24 * 60 * 60000 },
			],
		},
	],
	permissions: 'MODERATE_MEMBERS',
	callback: async ({ interaction, options }) => {
		const { locale, user } = interaction;

		let member = options.getMember('member') as GuildMember;
		let time = options.getNumber('time');
		let unit = options.getNumber('unit');
		let max = 28 * 24 * 60 * 60000;
		let msd = time * unit;

		if (!member.moderatable) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'timeout', 'MODERATABLE')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		try {
			let eSuccess = new SLEmbed().setSuccess(
				getMessage(locale, 'timeout', 'SUCCESS', { MEMBER: member.user.tag }),
				`Staff ${user.tag}`
			);

			await member.timeout(msd > max ? max : msd);
			interaction.reply({ embeds: [eSuccess] });
		} catch {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'timeout', 'EXCEPTION')
			);

			interaction
				.reply({ embeds: [eError], ephemeral: true })
				.catch(() => null);
		}
	},
});
