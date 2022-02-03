import { Captcha, db, getMessage } from '../../..';
import { Command, SLEmbed } from 'sl-commands';

export default new Command({
	name: 'cargos',
	type: 'SUBCOMMAND',
	reference: 'captcha',
	callback: ({ interaction, options }) => {
		const { locale, user } = interaction;

		let captcha = (db.get('captcha') || {}) as Captcha;
		let { messageId } = captcha;

		if (!messageId) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'captcha', 'NO_CAPTCHA')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		let removeRole = options.getRole('remover_cargo');
		let addRole = options.getRole('adicionar_cargo');

		if (removeRole.managed || addRole.managed) {
			let eError = new SLEmbed().setError(
				getMessage(locale, 'captcha', 'ROLES_MANAGED')
			);

			interaction.reply({ embeds: [eError], ephemeral: true });
			return;
		}

		captcha.rolesId = { add: [addRole.id], remove: [removeRole.id] };

		let eSuccess = new SLEmbed().setSuccess(
			getMessage(locale, 'captcha', 'ROLES'),
			user.tag
		);

		db.set('captcha', captcha);
		db.save();

		interaction.reply({ embeds: [eSuccess] });
	},
});
