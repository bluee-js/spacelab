import { Command } from 'sl-commands';

export default new Command({
	name: 'captcha',
	type: 'CHAT_INPUT',
	permissions: 'ADMINISTRATOR',
	description: 'Configura o sistema do captcha',
	options: [
		{
			name: 'canal',
			type: 'SUB_COMMAND',
			description: 'Onde o captcha será enviado',
			options: [
				{
					type: 'CHANNEL',
					name: 'canal_de_texto',
					description: 'O canal da mensagem fixa do captcha',
					channelTypes: ['GUILD_TEXT'],
					required: true,
				},
			],
		},
		{
			name: 'cargos',
			type: 'SUB_COMMAND',
			description: 'Quais cargos o captcha vai adicionar/remover',
			options: [
				{
					type: 'ROLE',
					name: 'adicionar_cargo',
					description: 'O cargo que será adicionado',
					required: true,
				},
				{
					type: 'ROLE',
					name: 'remover_cargo',
					description: 'O cargo que será removido',
				},
			],
		},
		{
			name: 'embed',
			type: 'SUB_COMMAND',
			description: 'Edita a embed do captcha',
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
			name: 'mostrar',
			type: 'SUB_COMMAND',
			description: 'Mostra a configuração atual do captcha',
		},
		{
			name: 'resetar',
			type: 'SUB_COMMAND',
			description: 'Deleta o captcha (cargos e embed incluídos)',
		},
	],
	callback: () => {},
});
