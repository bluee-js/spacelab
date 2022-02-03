import {
	TextChannel,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { db, getMessage, Captcha } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'channel',
	type: 'SUBCOMMAND',
	reference: 'canal',
	callback: async ({ interaction, options }) => {
		const { guild, locale, user } = interaction;

		let channel = options.getChannel('canal_de_texto') as TextChannel;
		let captcha = (db.get('captcha') || {}) as Captcha;

		let { embed, messageId, channelId } = captcha;

		if (messageId) {
			let oldChannel = guild.channels.cache.get(channelId) as TextChannel;
			oldChannel.messages.cache.get(messageId)?.delete();
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'captcha', 'CHANNEL', {
				CHANNEL: channel.name,
			}),
			user.tag
		);

		let eCaptcha = new MessageEmbed(
			embed ?? {
				description:
					'Clique no botão abaixo para se verificar.\n*Click the button below to verify yourself.*',
				title: 'Captcha',
				color: 'GREEN',
			}
		);

		let rCaptcha = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('SUCCESS')
				.setCustomId('captcha')
				.setLabel('Captcha')
		);

		captcha.messageId = (
			await channel.send({
				components: [rCaptcha],
				embeds: [eCaptcha],
			})
		).id;

		captcha.channelId = channel.id;

		db.set('captcha', captcha);
		db.save();

		await interaction.reply({ embeds: [eSuccess] });
	},
});
