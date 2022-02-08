import { get, save, getMessage, fetchMessage, Embed } from '../../..';
import { Command } from 'sl-commands';

export default new Command({
	name: 'cargos',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: async ({ client, interaction, options }) => {
		await interaction.deferReply({ ephemeral: true });
		const { locale } = interaction;

		let captcha = get('c');
		let { messageId, channelId } = captcha;
		let message = await fetchMessage(channelId, messageId, client);

		if (!message) {
			let eError = new Embed().setError(getMessage(locale, 'captcha', 'NO'));
			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let removeRole = options.getRole('remover_cargo');
		let addRole = options.getRole('adicionar_cargo');

		if (removeRole.managed || addRole.managed) {
			let eError = new Embed().setError(
				getMessage(locale, 'captcha', 'ROLES_MANAGED')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		captcha.rolesId = { add: [addRole.id], remove: [removeRole.id] };

		let eSuccess = new Embed().setSuccess(
			getMessage(locale, 'captcha', 'ROLES')
		);

		await save(captcha);
		interaction.editReply({ embeds: [eSuccess] });
	},
});
