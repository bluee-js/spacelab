import { Event } from 'sl-commands';

export default new Event('ready', async (client, handler) => {
  handler.logger.success('Bot ready!');
});
