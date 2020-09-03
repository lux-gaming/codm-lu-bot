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
	console.log(stripIndent`
	--- Bot is live ---
	`);
});

// new member welcome
bot.on('guildMemberAdd', member => {
	console.log(member)
	member.guild.channels.cache.get('704743628572196927').send(stripIndent`
	:wave: Welcome, <@${member.id}> to
	--- **${member.guild.name}** ---

	Don't forget to check out our ${member.guild.rulesChannel} channel and set your nickname to your CoDM player tag!
	`); 
});

// interactive functionality
bot.on('message', message => {
	console.log(message.author.username, ":", message.content)

	// for fun
	if (message.content === 'happy') {
		message.react('😄');
	}
	if (message.content === 'sad') {
		message.react('😢');
	}

	// simple info commands
	else if (message.content === 'server info') {
		message.channel.send(stripIndent`
			----- **${message.guild.name}** -----

			Founded: ${message.guild.createdAt}
			Region: ${message.guild.region}

			Owner: ${message.guild.owner}
			Members: ${message.guild.memberCount}

			Rules: ${message.guild.rulesChannel}
		`);
	} 
	else if (message.content === 'user info') {
		return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
	} 

	// easily delete multiple messages
	else if (message.content === 'prune 5') {
		if (message.member.roles.cache.has('745745452934103072')) {
		message.channel.bulkDelete(6);
		} 
		else {
			return message.reply(`${message.author.username}, you do not seem to be a moderator`)
		}
	}
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
	console.log('|----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----|');
	bot.connect();
});