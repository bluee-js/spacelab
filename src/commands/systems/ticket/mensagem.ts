import { get, save, fetchMessage, getMessage, Embed } from '../../..';
import { Collection, Message } from 'discord.js';
import { Command } from 'sl-commands';
import { once } from 'events';

export default new Command({
	name: 'mensagem',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		const { locale, channel, user } = interaction;

		let ticket = get('t');
		let { messageId, channelId } = ticket;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new Embed().setError(getMessage(locale, 'ticket', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'ticket', 'MESSAGE')
		);

		let eDesc = new Embed()
			.setLoading(getMessage(locale, 'ticket', 'DESCRIPTION'))
			.setFooter({ text: getMessage(locale, 'five_minutes') })
			.setDescription(getMessage(locale, 'ticket', 'PLACEHOLDERS'));

		await interaction.reply({ embeds: [eDesc] });

		const collector = channel.createMessageCollector({
			filter: (m) => m.author.equals(user) && !!m.content,
			time: 5 * 60000,
			max: 1,
		});

		let [collected, reason] = (await once(collector, 'end')) as [
			Collection<string, Message>,
			string
		];

		if (reason === 'time') {
			let eError = new Embed().setError(getMessage(locale, 'time_ran_out'));

			interaction.editReply({ embeds: [eError] });
			return;
		}

		ticket.message = {
			description: collected.first().content,
			title: options.getString('título'),
			color: options.getString('cor'),
		};

		await save(ticket);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
