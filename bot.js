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
	--- Bot online ---
	`);
});

// new member welcome
bot.on('guildMemberAdd', member => {
	console.log(member)
	member.guild.channels.cache.get('704743628572196927').send(`:wave: Welcome, <@${member.id}> to **${member.guild.name}**\nDon't forget to check out our ${member.guild.rulesChannel} channel and set your nickname to your CoDM player tag!`); 
});

// interactive functionality
bot.on('message', message => {
	console.log(message.author.username, ":", message.content)
	
	const args = message.content.toLowerCase().trim().split(' ');

	// for fun
	if (args[0] == 'happy') {
		message.react('😄');
	}
	if (args[0] == 'sad') {
		message.react('😢');
	}

	// Reply with server welcome
	if (args[0] == 'server-welcome') {
		const welcome = new Discord.MessageEmbed()
			.setTitle('Hello and welcome to **Call of Duty: Mobile Luxembourg**')
			.setDescription("We're a community server for CoD:M players based in Luxembourg, but are also open to all other EU West players")
			.addFields(
				{ name: '__Server Invite Link:__', value: '[https://discord.gg/uuagJHE](https://discord.gg/uuagJHE)' },
				{ name: '__General Information:__', value: "**Server Region:** Your CoDM Server Region should be Western Europe (EU West)\n**Time Zone:** Default time zone is CEST, when communicating time mention the time zone if it is any other.\n**Languages:** Primary language is Luxembourgish, but since we're all gamers, English is of course equally fine. French and German are welcome too."},
				{ name: '__Rules:__', value: '**Read the [official discord rules and guidelines](https://discordapp.com/guidelines)**\n**Naming:** Your name has to match your CoD:M player name (case-sensitive). If this is not the case, change your server nickname'},
				{ name: '__Contributing:__', value: '**Join our [Github organisation](https://github.com/lux-gaming)**\n**Contribute to our [homegrown bot](https://github.com/lux-gaming/codm-lu-bot)**'},
			)
			.setTimestamp()
		message.channel.send(welcome);
	}

	// Lists all affiliated servers
	if (args[0] == 'affiliate-servers') {
		const codmservers = new Discord.MessageEmbed()
			.setTitle('Official Call of Duty: Mobile Discord Servers')
			.setDescription('Join our official codm partner servers')
			.addFields(
				{ name: 'Global Servers', value: '[TiMi](https://discord.gg/codm)\n[The Other](https://discord.gg/callofdutymobile)' },
				{ name: 'EU Servers', value: '[:flag_lu: Luxembourg](https://discord.gg/uuagJHE)\n[:flag_de: Germany](https://discord.gg/JE65Bcf)\n[:flag_fr: France](https://discord.gg/SeQ6zmE)\n[:flag_it: Italy](https://discord.gg/g7yMEya)\n[:flag_es: Spain](https://discord.gg/EFcS6pn)'},
			)
			.setTimestamp()
		message.channel.send(codmservers);

		const luxservers = new Discord.MessageEmbed()
			.setTitle('Cool Luxembourg Discord Servers')
			.addFields(
				{ name: 'Gaming', value: '[E-Sports.lu](https://discord.gg/GUNyB36)\n[Lux Gaming Corner](https://discord.gg/7SjtxVr)' },
				{ name: 'Other', value: '[Gregorys shitty but sort of ok server](https://discord.gg/GEbmwVj)'},
			)
			.setTimestamp()
		message.channel.send(luxservers);
	}

	// simple info commands
	if (args[0] == 'server-info') {
		message.channel.send(stripIndent`
			----- **${message.guild.name}** -----

			Founded: ${message.guild.createdAt}
			Region: ${message.guild.region}

			Owner: ${message.guild.owner}
			Members: ${message.guild.memberCount}

			Rules: ${message.guild.rulesChannel}
		`);
	} 
	else if (args[0] == 'user-info') {
		return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
	} 

	// easily delete multiple messages
	if (args[0] == 'prune') {
		if (message.member.roles.cache.has('745745452934103072')) {
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