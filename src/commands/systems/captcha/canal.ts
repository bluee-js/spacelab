import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	TextChannel,
} from 'discord.js';

import { get, save, getMessage, fetchMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'canal',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let channel = options.getChannel('canal_de_texto') as TextChannel;

		let captcha = get('c');
		let { embed, messageId, channelId } = captcha;
		let message = await fetchMessage(channelId, messageId, client);

		if (message) message.delete().catch(() => null);

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'captcha', 'CHANNEL', {
				CHANNEL: channel.name,
			})
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
				.setLabel('Verificar | Verify')
		);

		captcha.channelId = channel.id;
		captcha.messageId = (
			await channel.send({
				components: [rCaptcha],
				embeds: [eCaptcha],
			})
		).id;

		await save(captcha, 'c');
		interaction.editReply({ embeds: [eSuccess] });
	},
});
