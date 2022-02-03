import { Command, SLEmbed } from 'sl-commands';
import { TextChannel } from 'discord.js';
import { getMessage } from '../../..';

export default new Command({
	name: 'trancar',
	type: 'SUBCOMMAND',
	reference: 'chat',
	callback: ({ interaction, options }) => {
		let { channel, guild, locale } = interaction;

		channel = (options.getChannel('canal_de_texto') || channel) as TextChannel;
		let eLock = new SLEmbed().setSuccess(getMessage(locale, 'chat', 'locked'));

		channel.permissionOverwrites.edit(guild.roles.everyone, {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
		});

		interaction.reply({ embeds: [eLock] });
	},
});
