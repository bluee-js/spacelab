import { get, EInteraction, getMessage, Embed } from '..';
import { Event } from 'sl-commands';
import { promisify } from 'util';

const wait = promisify(setTimeout);

export default new Event('interactionCreate', async (_, __, interaction) => {
	if (!interaction.isButton() || interaction.customId !== 'captcha') {
		return;
	}

	const { member, message, locale } = interaction as EInteraction<'BUTTON'>;
	let { messageId, rolesId } = get('c');

	if (!messageId || !rolesId || message.id !== messageId) {
		interaction.deferUpdate();
		return;
	}

	let { add, remove } = rolesId;
	let eLoading = new Embed().setSuccess(
		getMessage(locale, 'captcha', 'VERIFIED')
	);

	interaction.reply({ embeds: [eLoading], ephemeral: true });
	await wait(2000);

	if (remove) await member.roles.remove(remove);
	await member.roles.add(add);
});
