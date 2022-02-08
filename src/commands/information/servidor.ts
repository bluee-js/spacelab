import { Command } from 'sl-commands';

export default new Command({
	name: 'servidor',
	type: 'CHAT_INPUT',
	description: 'Obtenha informações sobre o servidor',
	options: [
		{
			name: 'ícone',
			type: 'SUB_COMMAND',
			description: 'Obtenha o ícone do servidor',
		},
	],
	callback: () => {},
});
