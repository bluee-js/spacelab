import { generateFromMessages } from 'discord-html-transcripts-tweaked';
import { db, EInteraction, getMessage, Ticket } from '..';
import { Event, SLEmbed } from 'sl-commands';
import { once } from 'events';

import {
	Message,
	TextChannel,
	MessageButton,
	OverwriteData,
	CategoryChannel,
	MessageActionRow,
	MessageEmbedOptions,
	PermissionResolvable,
} from 'discord.js';

export default new Event(
	'interactionCreate',
	async (client, __, interaction) => {
		if (!interaction.isSelectMenu() || interaction.customId !== 'ticket') {
			return;
		}

		const { guild, user, message, locale } =
			interaction as EInteraction<'SELECT'>;

		let {
			rolesId,
			messageId,
			categoryId,
			transcriptId,
			message: msg,
		} = (db.get('ticket') || {}) as Ticket;

		if (!messageId || !msg || message.id !== messageId) {
			interaction.deferUpdate();
			return;
		}

		let cTranscript = guild.channels.cache.get(transcriptId) as TextChannel;
		let category = guild.channels.cache.get(categoryId) as CategoryChannel;

		if (category.children.find((c: TextChannel) => c.topic === user.id)) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'ticket', 'ALREADY_CREATED')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let allow = [
			'READ_MESSAGE_HISTORY',
			'SEND_MESSAGES',
			'ATTACH_FILES',
			'VIEW_CHANNEL',
		] as PermissionResolvable[];

		let permissionOverwrites = [
			{
				type: 'member',
				id: user.id,
				allow,
			},
			...rolesId.map((id) => ({
				type: 'role',
				allow,
				id,
			})),
		] as OverwriteData[];

		let cTicket = await category.createChannel(`ticket-${user.tag}`, {
			topic: user.id,
			permissionOverwrites,
		});

		let eMessage = new SLEmbed(msg as MessageEmbedOptions);
		let rMessage = new MessageActionRow().addComponents(
			new MessageButton()
				.setEmoji('💾')
				.setStyle('PRIMARY')
				.setCustomId('save-close')
				.setLabel('Fechar | Close'),
			new MessageButton()
				.setEmoji('🔓')
				.setStyle('SECONDARY')
				.setCustomId('unlock')
				.setLabel('Destrancar | Unlock'),
			new MessageButton()
				.setEmoji('🔒')
				.setStyle('DANGER')
				.setCustomId('lock')
				.setLabel('Trancar | Lock')
		);

		let tMessage = await cTicket.send({
			content: `📌 **| **${user}`,
			components: [rMessage],
			embeds: [eMessage],
		});

		let eReply = new SLEmbed().setSuccess(
			getMessage(locale, 'ticket', 'TICKET_CREATED', {
				CATEGORY: interaction.values[0],
			})
		);

		let rReply = new MessageActionRow().addComponents(
			new MessageButton()
				.setStyle('LINK')
				.setLabel('Ticket')
				.setURL(tMessage.url)
		);

		interaction.reply({
			ephemeral: true,
			embeds: [eReply],
			components: [rReply],
		});

		const collector = tMessage.createMessageComponentCollector({
			filter: (i) => i.user.equals(user),
		});

		collector.on('collect', async (int: EInteraction<'BUTTON'>) => {
			if (
				int.customId.includes('lock') &&
				!rolesId.some((id) => int.member.roles.cache.has(id))
			) {
				let eError = new SLEmbed().setError(
					getMessage(locale, 'no_permission')
				);

				int.reply({ ephemeral: true, embeds: [eError] });
				return;
			}

			if (int.customId === 'lock') {
				cTicket.permissionOverwrites.edit(user, {
					SEND_MESSAGES: false,
				});

				let eLock = new SLEmbed()
					.setSuccess('Ticket trancado.')
					.setDescription('**Ticket locked.**');

				int.reply({ embeds: [eLock] });
			} else if (int.customId === 'unlock') {
				cTicket.permissionOverwrites.edit(user, {
					SEND_MESSAGES: true,
				});

				let eUnlock = new SLEmbed()
					.setSuccess('Ticket destrancado.')
					.setDescription('**Ticket unlocked.**');

				int.reply({ embeds: [eUnlock] });
			} else if (int.customId === 'save-close') {
				let messages = (await cTicket.messages.fetch()).filter(
					(m) => !m.author.bot
				);

				if (!messages.size) {
					let eError = new SLEmbed()
						.setError('Ainda não foram enviadas mensagens.')
						.setDescription('**No messages were sent yet.**');

					int.reply({ embeds: [eError], ephemeral: true });
					return;
				}

				let eClosing = new SLEmbed()
					.setLoading('Fechando ticket em 5 segundos...')
					.setDescription('**Closing ticket in 5 seconds...**')
					.setFooter({ text: getMessage(locale, 'ticket', 'TRANSCRIPT') });

				let rClosing = new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle('DANGER')
						.setCustomId('cancel')
						.setLabel('Cancelar | Cancel')
				);

				let mClose = (await int.reply({
					components: [rClosing],
					embeds: [eClosing],
					fetchReply: true,
				})) as Message;

				const collector = mClose.createMessageComponentCollector({
					filter: (i) => {
						if (i.user.equals(int.user)) return true;
						else {
							i.reply({
								content: "Você não pode cancelar.\n*You can't cancel.*",
								ephemeral: true,
							});
							return false;
						}
					},
					time: 5000,
					max: 1,
				});

				let [_, reason] = await once(collector, 'end');

				if (reason === 'limit') {
					let eCancelled = new SLEmbed()
						.setSuccess('Cancelado com sucesso.')
						.setDescription('**Successfully canceled.** ');

					mClose.edit({ embeds: [eCancelled], components: [] });
				} else {
					let trancript = await generateFromMessages(
						[...messages.values()],
						cTicket
					);

					let eTranscript = new SLEmbed()
						.setSuccess(
							'Novo transcrito',
							'Baixe a abra o arquivo em seu navegador'
						)
						.setDescription(
							`**Ticket:** #${cTicket.name}\n**Membro:** ${user} (${user.id})\n**Categoria:** ${interaction.values[0]}`
						);

					cTranscript.send({ embeds: [eTranscript], files: [trancript] });
					cTicket.delete();
				}
			}
		});
	}
);
