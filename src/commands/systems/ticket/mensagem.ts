import { db, fetchMessage, getMessage, Ticket } from '../../..';
import { Collection, Message } from 'discord.js';
import { Command, SLEmbed } from 'sl-commands';
import { once } from 'events';

export default new Command({
	name: 'mensagem',
	type: 'SUBCOMMAND',
	reference: 'ticket',
	callback: async ({ client, interaction, options }) => {
		const { locale, channel, user } = interaction;

		let ticket = (db.get('ticket') || {}) as Ticket;
		let { messageId, channelId } = ticket;

		if (!(await fetchMessage(channelId, messageId, client))) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'NO_TICKET')
			);
			
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'MESSAGE'),
			user.tag
		);

		let eDesc = new SLEmbed()
			.setLoading(getMessage(locale, 'ticket', 'DESCRIPTION'))
			.setFooter({ text: getMessage(locale, 'five_minutes') });

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
			let eError = new SLEmbed().setError(getMessage(locale, 'time_run_out'));

			interaction.editReply({ embeds: [eError] });
			return;
		}

		let { content } = collected.first();

		ticket.message = {
			title: options.getString('título'),
			color: options.getString('cor'),
			description: content,
		};

		db.set('ticket', ticket);
		db.save();

		interaction.editReply({ embeds: [eSuccess] });
	},
});
