import { Command, SLEmbed } from 'sl-commands';
import { TextChannel } from 'discord.js';
import { getMessage } from '../../..';

export default new Command({
	name: 'destrancar',
	type: 'SUBCOMMAND',
	reference: 'chat',
	callback: ({ interaction, options }) => {
		let { channel, guild, locale } = interaction;

		channel = (options.getChannel('canal_de_texto') || channel) as TextChannel;
		let eUnlock = new SLEmbed().setSuccess(
			getMessage(locale, 'chat', 'unlocked')
		);

		channel.permissionOverwrites.edit(guild.roles.everyone, {
			SEND_MESSAGES: null,
			ADD_REACTIONS: null,
		});

		interaction.reply({ embeds: [eUnlock] });
	},
});
