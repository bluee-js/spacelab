import { ApplicationCommandSubCommandData } from 'discord.js';
import { Command } from 'sl-commands';

export default new Command({
	name: 'ticket',
	type: 'CHAT_INPUT',
	permissions: 'ADMINISTRATOR',
	description: 'Configura o sistema do ticket',
	options: [
		{
			name: 'canal',
			type: 'SUB_COMMAND',
			description: 'Onde os tickets serão criados e enviados',
			options: [
				{
					type: 'CHANNEL',
					name: 'canal_de_texto',
					description: 'O canal da mensagem fixa do ticket',
					channelTypes: ['GUILD_TEXT'],
					required: true,
				},
				{
					type: 'CHANNEL',
					name: 'categoria',
					description: 'Onde os tickets serão criados',
					channelTypes: ['GUILD_CATEGORY'],
					required: true,
				},
				{
					type: 'CHANNEL',
					name: 'transcritos',
					description: 'Onde serão enviados os transcritos',
					channelTypes: ['GUILD_TEXT'],
					required: true,
				},
			],
		},
		{
			name: 'categorias',
			type: 'SUB_COMMAND',
			description: 'As categorias que serão escolhidas ao criar um ticket',
			options: [
				{
					type: 'STRING',
					name: 'categoria_1',
					description: 'Separe o nome do emoji com ";". Exemplo: "Suporte;📌"',
					required: true,
				},
				{
					type: 'STRING',
					name: 'categoria_2',
					description: 'Separe o nome do emoji com ";". Exemplo: "Suporte;📌"',
					required: true,
				},
				...(Array.from(Array(8), (_, x) => x + 3).map((x) => ({
					type: 'STRING',
					name: `categoria_${x}`,
					description: `Separe o nome do emoji com ";". Exemplo: "Suporte;📌"`,
				})) as ApplicationCommandSubCommandData['options']),
			],
		},
		{
			name: 'embed',
			type: 'SUB_COMMAND',
			description: 'Edita a embed do ticket (mensagem fixa)',
			options: [
				{
					name: 'título',
					type: 'STRING',
					description: 'Título da embed',
				},
				{
					type: 'STRING',
					name: 'descrição',
					description: 'Descrição da embed',
				},
				{
					name: 'cor',
					type: 'STRING',
					description: 'Cor da embed',
				},
				{
					name: 'imagem',
					type: 'STRING',
					description: 'Imagem da embed',
				},
			],
		},
		{
			name: 'mensagem',
			type: 'SUB_COMMAND',
			description: 'Edita a embed que é enviada quando alguém cria um ticket',
			options: [
				{
					name: 'título',
					type: 'STRING',
					description: 'Título da embed',
				},
				{
					name: 'cor',
					type: 'STRING',
					description: 'Cor da embed',
				},
			],
		},
		{
			name: 'cargos',
			type: 'SUB_COMMAND',
			description: 'Os cargos que terão permissão de interagir com tickets',
			options: [
				{
					type: 'ROLE',
					name: 'cargo_1',
					description: 'Cargo 1',
					required: true,
				},
				...(Array.from(Array(4), (_, x) => x + 2).map((x) => ({
					type: 'STRING',
					name: `cargo_${x}`,
					description: `Cargo ${x}`,
				})) as ApplicationCommandSubCommandData['options']),
			],
		},
		{
			name: 'mostrar',
			type: 'SUB_COMMAND',
			description: 'Mostra a configuração atual do ticket',
		},
		{
			name: 'resetar',
			type: 'SUB_COMMAND',
			description: 'Deleta o ticket (categorias, mensagem e embed incluídos)',
		},
	],
	callback: () => {},
});
