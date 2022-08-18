const { Collector } = require("discord.js");

const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
var config = require(currentDir + 'config.js');
const mysql = require('mysql2');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands','h'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Glad you are asking me for help with the dtube curation!');
			data.push('The obvious command is ```&curate <link> <category> <tip(optional)>```with which you can curate dtube videos.');
			data.push('Make sure to only curate a video when you are **100% sure** that the **author is the creator** of the video (and the author is not yourself ;) )!');
			data.push('The video should also **not violate any common moral rules** - so no hate, violence or any other suspicous topics. Thank you!');
			data.push('Feel also free to **ask other curators** what they think about a specific video when you are not sure.\n');
			data.push('**Here\'s a list of all the commands I support:**');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${config.discord.prefix}help [command name]\` in the  ${message.guild.name} server to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${config.discord.prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};