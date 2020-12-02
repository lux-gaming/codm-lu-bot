const { roles, channels } = require('./config.json');

// create a new Discord bot session
const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
bot.login(process.env.AUTH_TOKEN);

// this event will only trigger once: on bot init
bot.on('ready', () => {
	console.log('\x1b[32m%s\x1b[0m', "--- Bot online ---");
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
	// for testing only: console.log(message.author.username, ":", message.content)
	
	const args = message.content.toLowerCase().trim().split(' ');
	const command = args.shift();
	console.log(command, args);

	switch (command) {
		case 'happy':
			message.react('😄');
			break;
		case 'sad':
			message.react('😢');
			break;
		case 'count':
			switch (args[0]) {
				case 'from':
					if (args[1] != undefined) {
						if (args[1] <= 10 ) {
							message.channel.send("I'm counting ...");
							for ( var i = args[1] ; i > 0 ; i-- ) {
								message.channel.send(i);
							}
							message.channel.send("Done");
						}
						else {
							message.channel.send("Please refrain from spamming");
						}
					} else {
						message.channel.send("From what number would you like me to count down?");
					}
					break;
				case 'to':
					if (args[1] != undefined) {
						if (args[1] <= 10 ) {
							message.channel.send("I'm counting ...");
							for ( var i = 1 ; i <= args[1] ; i++ ) {
								message.channel.send(i);
							}
							message.channel.send("Done");
						}
						else {
							message.channel.send("Please refrain from spamming");
						}
					}
					else {
						message.channel.send("Until what number would you like me to count?");
					}
					break;
				default:
					message.channel.send("How would you like me to count?"); 
			}
			break;
		case 'welcome':
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
			break;
		case 'info':
			switch(args[0]) {
				case 'server':
					message.channel.send(
						new Discord.MessageEmbed()
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
					break;
				case 'user':
					return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
				default:
					message.channel.send("On which subject doth thee seek knowledge?");
			}
	}
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
	console.log('\x1b[31m%s\x1b[0m', `--- Bot disconnected from Discord with code ${code} for the following reason: ${erMsg} ---`);
	bot.connect();
});