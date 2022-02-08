import { getMessage, Embed } from '../../..';
import { TextChannel } from 'discord.js';
import { Command } from 'sl-commands';

export default new Command({
	name: 'trancar',
	type: 'SUBCOMMAND',
	reference: 'chat',
	callback: ({ interaction, options }) => {
		let { channel, guild, locale } = interaction;

		channel = (options.getChannel('canal_de_texto') || channel) as TextChannel;
		let eLock = new Embed().setSuccess(getMessage(locale, 'chat', 'locked'));

		channel.permissionOverwrites.edit(guild.roles.everyone, {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
		});

		interaction.reply({ embeds: [eLock] });
	},
});
