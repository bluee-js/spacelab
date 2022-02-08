import { Event } from 'sl-commands';

export default new Event('ready', async (client, handler) => {
	client.user.setActivity({ name: 'spacelabs.app', type: 'WATCHING' });
	handler.logger.success('Bot ready!');
});
