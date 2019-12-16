const Discord = require("discord.js");
const { prefix, token, adminID } = require("./../config.json");
const { readdirSync } = require("fs");
const { join } = require("path");

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "modules")).filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./modules/${file}`);

    client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!"); 
	client.user.setActivity(`${prefix}generate`);
});

client.on("message", async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

    if (command.args && !args.length) {
		let reply = `Arguments are required to execute that command ${message.member.displayName}.`;
		
		if (command.usage) {
			reply += `\nProper usage would be: \`${prefix}${command.name} ${command.usage}\`\n*Please note arguments preceded by a* **?** *character are optional*`;
		}

		message.channel.send(reply);
    }

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	if (command.guildOnly && message.channel.type !== "text") return message.channel.send("Please try executing this command inside of a Guild (server).");
    if (command.disabled && message.author.id !== adminID) return message.channel.send("That command is either non-existent or it is (globally) disabled. Please try again later.");
    if (command.adminOnly && message.author.id !== adminID) return message.channel.send(`Unfortunately ${message.author}, you lack the required clearance level for this command. Try contacting a system administrator for further assistance`);

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	if(message.author.id !== adminID) timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
	    await command.execute(message, args);
	} catch (error) {
	    console.error(error);
	    message.reply(`The following error occurred executing the **${commandName}** command:\n\n\`\`\`js\n${error}\`\`\``, { split: true });
	}
});

client.login(token);