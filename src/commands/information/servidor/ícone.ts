import { Command } from 'sl-commands';
import { Embed } from '../../..';

export default new Command({
	name: 'ícone',
	type: 'SUBCOMMAND',
	reference: 'servidor',
	callback: async ({ interaction }) => {
		const { locale, guild } = interaction;

		let baseUrl = guild.iconURL({ dynamic: true, format: 'png' });

		let eIcon = new Embed()
			.setImage(baseUrl)
			.setTitle(`🖼️ ${guild.name}`)
			.setDescription(`**[Clique aqui para baixar a imagem](${baseUrl})**`);

		interaction.reply({ embeds: [eIcon] });
	},
});
