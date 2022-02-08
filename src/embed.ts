import { MessageEmbedOptions } from 'discord.js';
import { SLEmbed } from 'sl-commands';

const icons = {
	success: 'https://i.imgur.com/KxCMDH0.png',
	error: 'https://i.imgur.com/Nk1GKzw.png',
	arrow: 'https://cdn.discordapp.com/emojis/851206127471034378.png',
};

export class Embed extends SLEmbed {
	constructor(obj?: MessageEmbedOptions) {
		super(obj);

		this.setColor(obj?.color ?? '#5534D9');
	}

	setSuccess(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: icons.success });

		if (footer) {
			this.setFooter({ text: footer, iconURL: icons.arrow });
		}

		return this;
	}

	setError(name: string, footer?: string): this {
		this.setAuthor({ name, iconURL: icons.error }).setColor('#FF5051');

		if (footer) {
			this.setFooter({ text: footer, iconURL: icons.arrow });
		}

		return this;
	}
}
