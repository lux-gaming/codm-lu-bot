const { roles, channels } = require('./config.json');

// create a new Discord bot session
const Discord = require('discord.js');
const bot = new Discord.Client();
const { auth_token } = require('./auth_token.json');
bot.login(auth_token);

// this event will only trigger once: on bot init
bot.on('ready', () => {
	console.log("--- Bot online ---");
	const args = process.argv.slice(2);
	if (args[0] == "announce") {
		bot.channels.cache.get(channels.bots).send("Hello there! I'm back online");
	}
});

// new member welcome
bot.on('guildMemberAdd', member => {
	console.log(`${member} joined the server`)
	member.guild.channels.cache.get(channels.welcome).send(`:wave: Welcome, <@${member.id}> to **${member.guild.name}** :wave:`); 
});

// interactive functionality
bot.on('message', message => {
	// for tesing only: console.log(message.author.username, ":", message.content)
	
	const command = message.content.toLowerCase().trim()
	const args = command.split(' ');

	// for fun
	if (command == 'happy') {
		message.react('😄');
	}
	if (command == 'sad') {
		message.react('😢');
	}

	// counting
	if (args[0] == 'count') {
		if (isNaN(args[1])) {
			message.channel.send("How far would you like me to count?"); 
		}
		else {
			for ( var i = 1 ; i <= args[1] ; i++ ) {
				message.channel.send(i);
			}
		}
	}

	// Reply with server welcome
	if (command == 'server welcome') {
		const welcome = new Discord.MessageEmbed()
			.setTitle(`Hello and welcome to the **${message.guild.name}**`)
			.setDescription("We're a community of devs")
			.addFields(
				{ name: 'Server Invite Link', value: '[https://discord.gg/https://discord.gg/DKKkJYj8hu](https://discord.gg/https://discord.gg/DKKkJYj8hu)' },
				{ name: 'Rules', value: '**Read the [official discord rules and guidelines](https://discordapp.com/guidelines)**'},
				{ name: 'Contributing', value: '**Contribute to our [homegrown bot](https://github.com/nico-bachner/dev-bot)**'}
			)
			.setTimestamp()
		message.channel.send(welcome);
	}

	// simple info commands
	if (command == 'server info') {
		message.channel.send(new Discord.MessageEmbed()
			.setTitle(`**${message.guild.name}**`)
			.addFields(
				{ name: 'Founded', value: message.guild.createdAt },
				{ name: 'Region', value: message.guild.region },
				{ name: 'Owner', value: message.guild.owner },
				{ name: 'Members', value: message.guild.memberCount },
				{ name: 'Rules', value: message.guild.rulesChannel }
			)
			.setTimestamp()
		);
	} 
	else if (command == 'user info') {
		return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
	} 

	// easily delete multiple messages
	if (args[0] == 'prune') {
		if (message.member.roles.cache.has(roles.moderator)) {
			message.channel.bulkDelete(parseInt(args[1]) + 1);
		} 
		else {
			return message.reply(`(${message.author.username}), only moderators are permitted to use this command`)
		}
	}
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
	console.log('|----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----|');
	bot.connect();
});