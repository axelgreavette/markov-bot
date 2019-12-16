const { prefix } = require("./../../config.json");

module.exports = {
    name: "help",
    description: "List all of my commands or info about a specific command.",
    aliases: ["commands"],
    usage: "<?command name>",
    cooldown: 5,
    execute(message, args) {
        const body = [];
        const { commands } = message.client;

        if (!args[0]) {
            body.push("Here is a list of all active modules:\n");
            body.push(commands.filter(command => {
                if (command.hidden || command.disabled || command.adminOnly) return false;
                return true
            }).map(command => `**${command.name}** :: ${command.description}`).join("\n"));
            body.push(`\nYou can use **${prefix}help <command name>** for further information on specific modules.`);
            body.push(`*If an argument is proceeded by a __?__ character it is optional.*`);
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.channel.send("Invalid module.");
            }

            body.push(`**Name:** ${command.name}`);

            if (command.aliases) body.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) body.push(`**Description:** ${command.description}`);
            if (command.usage) body.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

            body.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        }

        message.channel.send(body, { split: true });
    }
}