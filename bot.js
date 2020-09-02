// formatting
const { stripIndent } = require('common-tags')

// stores API keys in separate JSON file
const { token } = require('./token.json');

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const bot = new Discord.Client();

// auth
bot.login(token);

// when the client is ready, run this code
// this event will only trigger one time after logging in
bot.once('ready', () => {
	console.log('Bot is live');
});

bot.on('message', message => {
	console.log(message.author.username, ":", message.content)

	// simple info commands
	if (message.content === 'server info') {
		message.channel.send(stripIndent`
			__*Server Info*__
			Server Name: **${message.guild.name}**
			Members: **${message.guild.memberCount}**
		`);
	} 
	else if (message.content === 'user info') {
		return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
	} 

	// easily delete multiple messages
	else if (message.content === 'prune 5') {
		message.channel.bulkDelete(6);
	}
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
	console.log('|----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----|');
	bot.connect();
});