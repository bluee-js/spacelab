import { Command } from 'sl-commands';

export default new Command({
	name: 'chat',
	type: 'CHAT_INPUT',
	description: 'Modere o chat',
	permissions: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
	options: [
		{
			name: 'limpar',
			type: 'SUB_COMMAND',
			description: 'Limpe mensagens em um canal de texto',
			options: [
				{
					type: 'NUMBER',
					name: 'quantidade',
					description: 'Quantas mensagens serão excluídas (até 1000)',
					required: true,
					maxValue: 1000,
					minValue: 1,
				},
				{
					type: 'CHANNEL',
					name: 'canal_de_texto',
					description: 'Em qual canal serão apagadas as mensagens',
					channelTypes: ['GUILD_TEXT'],
				},
				{
					type: 'USER',
					name: 'filtrar_por_usuário',
					description: 'Apenas serão apagadas mensagens deste usuário',
				},
			],
		},
		{
			name: 'trancar',
			type: 'SUB_COMMAND',
			description: 'Impeça todos de enviarem mensagens em um canal de texto',
			options: [
				{
					type: 'CHANNEL',
					name: 'canal_de_texto',
					description: 'Qual canal será trancado',
					channelTypes: ['GUILD_TEXT'],
				},
			],
		},
		{
			name: 'destrancar',
			type: 'SUB_COMMAND',
			description: 'Desimpeça todos de enviarem mensagem em um canal de texto',
			options: [
				{
					type: 'CHANNEL',
					name: 'canal_de_texto',
					description: 'Qual canal será destrancado',
					channelTypes: ['GUILD_TEXT'],
				},
			],
		},
	],
	callback: () => {},
});
