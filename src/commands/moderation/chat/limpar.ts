import { Command, SLEmbed } from 'sl-commands';
import { Message, TextChannel } from 'discord.js';
import { getMessage } from '../../..';

export default new Command({
	name: 'limpar',
	type: 'SUBCOMMAND',
	reference: 'chat',
	callback: async ({ interaction, options }) => {
		let { channel, locale } = interaction;
		let now = Date.now();

		channel = (options.getChannel('canal_de_texto') as TextChannel) || channel;
		let filtered = options.getUser('filtrar_por_usuário');
		let quantity = options.getNumber('quantidade');
		let sum = 0;

		let eDelete = new SLEmbed().setLoading(
			getMessage(locale, 'chat', 'deleting', { Q: 0 })
		);

		await interaction.reply({ embeds: [eDelete], ephemeral: true });

		deleteMessages(quantity);

		async function deleteMessages(i: number) {
			if (i === 0) {
				eDelete.setSuccess(getMessage(locale, 'chat', 'deleted', { Q: sum }));
				interaction.editReply({ embeds: [eDelete] });
				return;
			}

			await channel.messages.fetch();
			let msgs = channel.messages.cache.filter(
				(m) => !m.pinned && m.createdTimestamp < now && m.deletable
			);

			let q = i > 100 ? 100 : i;
			let filter: Message[];

			if (filtered) {
				filter = msgs.filter((m) => m.author.equals(filtered)).first(q);
			} else {
				filter = msgs.first(q);
			}

			let { size } = await (channel as TextChannel).bulkDelete(filter, true);
			sum += size;
			i -= q;

			if (size === 0) {
				eDelete.setSuccess(getMessage(locale, 'chat', 'deleted', { Q: sum }));
				interaction.editReply({ embeds: [eDelete] });
				return;
			}

			eDelete.setLoading(getMessage(locale, 'chat', 'deleting', { Q: sum }));
			await interaction.editReply({ embeds: [eDelete] });

			deleteMessages(i);
		}
	},
});
